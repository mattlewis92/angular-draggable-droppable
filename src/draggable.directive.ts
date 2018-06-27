import {
  Directive,
  OnInit,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  OnChanges,
  NgZone,
  SimpleChanges,
  Inject,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Subject, Observable, merge, ReplaySubject } from 'rxjs';
import {
  map,
  mergeMap,
  takeUntil,
  take,
  takeLast,
  pairwise,
  share,
  filter,
  count
} from 'rxjs/operators';
import { CurrentDragData, DraggableHelper } from './draggable-helper.provider';
import { DOCUMENT } from '@angular/common';

export interface Coordinates {
  x: number;
  y: number;
}

export interface DragAxis {
  x: boolean;
  y: boolean;
}

export interface SnapGrid {
  x?: number;
  y?: number;
}

export interface DragStart {
  cancelDrag$: ReplaySubject<void>;
}

export interface DragEnd extends Coordinates {
  dragCancelled: boolean;
}

export type ValidateDrag = (coordinates: Coordinates) => boolean;

export interface PointerEvent {
  clientX: number;
  clientY: number;
  event: MouseEvent | TouchEvent;
}

@Directive({
  selector: '[mwlDraggable]'
})
export class DraggableDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * an object of data you can pass to the drop event
   */
  @Input() dropData: any;

  /**
   * The axis along which the element is draggable
   */
  @Input() dragAxis: DragAxis = { x: true, y: true };

  /**
   * Snap all drags to an x / y grid
   */
  @Input() dragSnapGrid: SnapGrid = {};

  /**
   * Show a ghost element that shows the drag when dragging
   */
  @Input() ghostDragEnabled: boolean = true;

  /**
   * Show the original element when ghostDragEnabled is true
   */
  @Input() showOriginalElementWhileDragging: boolean = false;

  /**
   * Allow custom behaviour to control when the element is dragged
   */
  @Input() validateDrag: ValidateDrag;

  /**
   * The cursor to use when dragging the element
   */
  @Input() dragCursor: string = '';

  /**
   * The css class to apply when the element is being dragged
   */
  @Input() dragActiveClass: string;

  /**
   * The element the ghost element will be appended to. Default is next to the dragged element
   */
  @Input() ghostElementAppendTo: HTMLElement;

  /**
   * An ng-template to be inserted into the parent element of the ghost element. It will overwrite any child nodes.
   */
  @Input() ghostElementTemplate: TemplateRef<any>;

  /**
   * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
   */
  @Output() dragPointerDown = new EventEmitter<Coordinates>();

  /**
   * Called when the element has started to be dragged.
   * Only called after at least one mouse or touch move event.
   * If you call $event.cancelDrag$.emit() it will cancel the current drag
   */
  @Output() dragStart = new EventEmitter<DragStart>();

  /**
   * Called after the ghost element has been created
   */
  @Output() ghostElementCreated = new EventEmitter();

  /**
   * Called when the element is being dragged
   */
  @Output() dragging = new EventEmitter<Coordinates>();

  /**
   * Called after the element is dragged
   */
  @Output() dragEnd = new EventEmitter<DragEnd>();

  /**
   * @hidden
   */
  pointerDown: Subject<PointerEvent> = new Subject();

  /**
   * @hidden
   */
  pointerMove: Subject<PointerEvent> = new Subject();

  /**
   * @hidden
   */
  pointerUp: Subject<PointerEvent> = new Subject();

  private eventListenerSubscriptions: {
    mousemove?: () => void;
    mousedown?: () => void;
    mouseup?: () => void;
    mouseenter?: () => void;
    mouseleave?: () => void;
    touchstart?: () => void;
    touchmove?: () => void;
    touchend?: () => void;
    touchcancel?: () => void;
  } = {};

  private ghostElement: HTMLElement | null;

  /**
   * @hidden
   */
  constructor(
    private element: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private draggableHelper: DraggableHelper,
    private zone: NgZone,
    private vcr: ViewContainerRef,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.checkEventListeners();

    const pointerDragged$: Observable<any> = this.pointerDown.pipe(
      filter(() => this.canDrag()),
      mergeMap((pointerDownEvent: PointerEvent) => {
        // hack to prevent text getting selected in safari while dragging
        const globalDragStyle: HTMLStyleElement = this.renderer.createElement(
          'style'
        );
        this.renderer.setAttribute(globalDragStyle, 'type', 'text/css');
        this.renderer.appendChild(
          globalDragStyle,
          this.renderer.createText(`
          body * {
           -moz-user-select: none;
           -ms-user-select: none;
           -webkit-user-select: none;
           user-select: none;
          }
        `)
        );
        this.document.head.appendChild(globalDragStyle);

        const currentDrag$ = new Subject<CurrentDragData>();
        const cancelDrag$ = new ReplaySubject<void>();

        this.zone.run(() => {
          this.dragPointerDown.next({ x: 0, y: 0 });
        });

        const pointerMove = this.pointerMove.pipe(
          map((pointerMoveEvent: PointerEvent) => {
            return {
              currentDrag$,
              x: pointerMoveEvent.clientX - pointerDownEvent.clientX,
              y: pointerMoveEvent.clientY - pointerDownEvent.clientY,
              clientX: pointerMoveEvent.clientX,
              clientY: pointerMoveEvent.clientY
            };
          }),
          map(moveData => {
            if (this.dragSnapGrid.x) {
              moveData.x =
                Math.round(moveData.x / this.dragSnapGrid.x) *
                this.dragSnapGrid.x;
            }

            if (this.dragSnapGrid.y) {
              moveData.y =
                Math.round(moveData.y / this.dragSnapGrid.y) *
                this.dragSnapGrid.y;
            }

            return moveData;
          }),
          map(moveData => {
            if (!this.dragAxis.x) {
              moveData.x = 0;
            }

            if (!this.dragAxis.y) {
              moveData.y = 0;
            }

            return moveData;
          }),
          filter(
            ({ x, y }) => !this.validateDrag || this.validateDrag({ x, y })
          ),
          takeUntil(merge(this.pointerUp, this.pointerDown, cancelDrag$)),
          share()
        );

        const dragStarted$ = pointerMove.pipe(
          take(1),
          share()
        );
        const dragEnded$ = pointerMove.pipe(
          takeLast(1),
          share()
        );

        dragStarted$.subscribe(() => {
          this.zone.run(() => {
            this.dragStart.next({ cancelDrag$ });
          });

          this.renderer.addClass(
            this.element.nativeElement,
            this.dragActiveClass
          );

          if (this.ghostDragEnabled) {
            const rect = this.element.nativeElement.getBoundingClientRect();
            const clone = this.element.nativeElement.cloneNode(
              true
            ) as HTMLElement;
            if (!this.showOriginalElementWhileDragging) {
              this.renderer.setStyle(
                this.element.nativeElement,
                'visibility',
                'hidden'
              );
            }

            if (this.ghostElementAppendTo) {
              this.ghostElementAppendTo.appendChild(clone);
            } else {
              this.element.nativeElement.parentNode!.insertBefore(
                clone,
                this.element.nativeElement.nextSibling
              );
            }

            this.ghostElement = clone;

            this.setElementStyles(clone, {
              position: 'fixed',
              top: `${rect.top}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              cursor: this.dragCursor,
              margin: '0'
            });

            if (this.ghostElementTemplate) {
              const viewRef = this.vcr.createEmbeddedView(
                this.ghostElementTemplate
              );
              clone.innerHTML = '';
              viewRef.rootNodes
                .filter(node => node instanceof Node)
                .forEach(node => {
                  clone.appendChild(node);
                });
              dragEnded$.subscribe(() => {
                this.vcr.remove(this.vcr.indexOf(viewRef));
              });
            }

            this.zone.run(() => {
              this.ghostElementCreated.emit();
            });

            dragEnded$.subscribe(() => {
              clone.parentElement!.removeChild(clone);
              this.ghostElement = null;
              this.renderer.setStyle(
                this.element.nativeElement,
                'visibility',
                ''
              );
            });
          }

          this.draggableHelper.currentDrag.next(currentDrag$);
        });

        dragEnded$
          .pipe(
            mergeMap(dragEndData => {
              const dragEndData$ = cancelDrag$.pipe(
                count(),
                take(1),
                map(calledCount => ({
                  ...dragEndData,
                  dragCancelled: calledCount > 0
                }))
              );
              cancelDrag$.complete();
              return dragEndData$;
            })
          )
          .subscribe(({ x, y, dragCancelled }) => {
            this.document.head.removeChild(globalDragStyle);
            currentDrag$.complete();
            this.zone.run(() => {
              this.dragEnd.next({ x, y, dragCancelled });
            });
            this.renderer.removeClass(
              this.element.nativeElement,
              this.dragActiveClass
            );
          });

        return pointerMove;
      }),
      share()
    );

    merge(
      pointerDragged$.pipe(
        take(1),
        map(value => [, value])
      ),
      pointerDragged$.pipe(pairwise())
    )
      .pipe(
        filter(([previous, next]) => {
          if (!previous) {
            return true;
          }
          return previous.x !== next.x || previous.y !== next.y;
        }),
        map(([previous, next]) => next)
      )
      .subscribe(({ x, y, currentDrag$, clientX, clientY }) => {
        this.zone.run(() => {
          this.dragging.next({ x, y });
        });
        if (this.ghostElement) {
          const transform = `translate(${x}px, ${y}px)`;
          this.setElementStyles(this.ghostElement, {
            transform,
            '-webkit-transform': transform,
            '-ms-transform': transform,
            '-moz-transform': transform,
            '-o-transform': transform
          });
        }
        currentDrag$.next({
          clientX,
          clientY,
          dropData: this.dropData
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dragAxis) {
      this.checkEventListeners();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeEventListeners();
    this.pointerDown.complete();
    this.pointerMove.complete();
    this.pointerUp.complete();
  }

  private checkEventListeners(): void {
    const canDrag: boolean = this.canDrag();
    const hasEventListeners: boolean =
      Object.keys(this.eventListenerSubscriptions).length > 0;

    if (canDrag && !hasEventListeners) {
      this.zone.runOutsideAngular(() => {
        this.eventListenerSubscriptions.mousedown = this.renderer.listen(
          this.element.nativeElement,
          'mousedown',
          (event: MouseEvent) => {
            this.onMouseDown(event);
          }
        );

        this.eventListenerSubscriptions.mouseup = this.renderer.listen(
          'document',
          'mouseup',
          (event: MouseEvent) => {
            this.onMouseUp(event);
          }
        );

        this.eventListenerSubscriptions.touchstart = this.renderer.listen(
          this.element.nativeElement,
          'touchstart',
          (event: TouchEvent) => {
            this.onTouchStart(event);
          }
        );

        this.eventListenerSubscriptions.touchend = this.renderer.listen(
          'document',
          'touchend',
          (event: TouchEvent) => {
            this.onTouchEnd(event);
          }
        );

        this.eventListenerSubscriptions.touchcancel = this.renderer.listen(
          'document',
          'touchcancel',
          (event: TouchEvent) => {
            this.onTouchEnd(event);
          }
        );

        this.eventListenerSubscriptions.mouseenter = this.renderer.listen(
          this.element.nativeElement,
          'mouseenter',
          () => {
            this.onMouseEnter();
          }
        );

        this.eventListenerSubscriptions.mouseleave = this.renderer.listen(
          this.element.nativeElement,
          'mouseleave',
          () => {
            this.onMouseLeave();
          }
        );
      });
    } else if (!canDrag && hasEventListeners) {
      this.unsubscribeEventListeners();
    }
  }

  private onMouseDown(event: MouseEvent): void {
    if (!this.eventListenerSubscriptions.mousemove) {
      this.eventListenerSubscriptions.mousemove = this.renderer.listen(
        'document',
        'mousemove',
        (mouseMoveEvent: MouseEvent) => {
          this.pointerMove.next({
            event: mouseMoveEvent,
            clientX: mouseMoveEvent.clientX,
            clientY: mouseMoveEvent.clientY
          });
        }
      );
    }
    this.pointerDown.next({
      event,
      clientX: event.clientX,
      clientY: event.clientY
    });
  }

  private onMouseUp(event: MouseEvent): void {
    if (this.eventListenerSubscriptions.mousemove) {
      this.eventListenerSubscriptions.mousemove();
      delete this.eventListenerSubscriptions.mousemove;
    }
    this.pointerUp.next({
      event,
      clientX: event.clientX,
      clientY: event.clientY
    });
  }

  private onTouchStart(event: TouchEvent): void {
    if (!this.eventListenerSubscriptions.touchmove) {
      this.eventListenerSubscriptions.touchmove = this.renderer.listen(
        'document',
        'touchmove',
        (touchMoveEvent: TouchEvent) => {
          this.pointerMove.next({
            event: touchMoveEvent,
            clientX: touchMoveEvent.targetTouches[0].clientX,
            clientY: touchMoveEvent.targetTouches[0].clientY
          });
        }
      );
    }
    this.pointerDown.next({
      event,
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY
    });
  }

  private onTouchEnd(event: TouchEvent): void {
    if (this.eventListenerSubscriptions.touchmove) {
      this.eventListenerSubscriptions.touchmove();
      delete this.eventListenerSubscriptions.touchmove;
    }
    this.pointerUp.next({
      event,
      clientX: event.changedTouches[0].clientX,
      clientY: event.changedTouches[0].clientY
    });
  }

  private onMouseEnter(): void {
    this.setCursor(this.dragCursor);
  }

  private onMouseLeave(): void {
    this.setCursor('');
  }

  private canDrag(): boolean {
    return this.dragAxis.x || this.dragAxis.y;
  }

  private setCursor(value: string): void {
    this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
  }

  private unsubscribeEventListeners(): void {
    Object.keys(this.eventListenerSubscriptions).forEach(type => {
      (this as any).eventListenerSubscriptions[type]();
      delete (this as any).eventListenerSubscriptions[type];
    });
  }

  private setElementStyles(
    element: HTMLElement,
    styles: { [key: string]: string }
  ) {
    Object.keys(styles).forEach(key => {
      this.renderer.setStyle(element, key, styles[key]);
    });
  }
}
