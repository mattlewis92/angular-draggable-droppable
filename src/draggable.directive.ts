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
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { take } from 'rxjs/operators/take';
import { takeLast } from 'rxjs/operators/takeLast';
import { pairwise } from 'rxjs/operators/pairwise';
import { share } from 'rxjs/operators/share';
import { filter } from 'rxjs/operators/filter';
import { DraggableHelper } from './draggable-helper.provider';

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

export type ValidateDrag = (coordinates: Coordinates) => boolean;

export interface PointerEvent {
  clientX: number;
  clientY: number;
  event: MouseEvent | TouchEvent;
}

const MOVE_CURSOR: string = 'move';

@Directive({
  selector: '[mwlDraggable]'
})
export class DraggableDirective implements OnInit, OnChanges, OnDestroy {
  @Input() dropData: any;

  @Input() dragAxis: DragAxis = { x: true, y: true };

  @Input() dragSnapGrid: SnapGrid = {};

  @Input() ghostDragEnabled: boolean = true;

  @Input() validateDrag: ValidateDrag;

  @Input() dragCursor = MOVE_CURSOR;

  @Output()
  dragPointerDown: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output()
  dragStart: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output()
  dragging: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output()
  dragEnd: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

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

  /**
   * @hidden
   */
  constructor(
    public element: ElementRef,
    private renderer: Renderer2,
    private draggableHelper: DraggableHelper,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.checkEventListeners();

    const pointerDrag: Observable<any> = this.pointerDown
      .pipe(filter(() => this.canDrag()))
      .pipe(
        mergeMap((pointerDownEvent: PointerEvent) => {
          const currentDrag: Subject<any> = new Subject();

          this.zone.run(() => {
            this.dragPointerDown.next({ x: 0, y: 0 });
          });

          const pointerMove: Observable<Coordinates> = this.pointerMove
            .pipe(
              map((pointerMoveEvent: PointerEvent) => {
                pointerMoveEvent.event.preventDefault();

                return {
                  currentDrag,
                  x: pointerMoveEvent.clientX - pointerDownEvent.clientX,
                  y: pointerMoveEvent.clientY - pointerDownEvent.clientY,
                  clientX: pointerMoveEvent.clientX,
                  clientY: pointerMoveEvent.clientY
                };
              })
            )
            .pipe(
              map((moveData: Coordinates) => {
                if (this.dragSnapGrid.x) {
                  moveData.x =
                    Math.floor(moveData.x / this.dragSnapGrid.x) *
                    this.dragSnapGrid.x;
                }

                if (this.dragSnapGrid.y) {
                  moveData.y =
                    Math.floor(moveData.y / this.dragSnapGrid.y) *
                    this.dragSnapGrid.y;
                }

                return moveData;
              })
            )
            .pipe(
              map((moveData: Coordinates) => {
                if (!this.dragAxis.x) {
                  moveData.x = 0;
                }

                if (!this.dragAxis.y) {
                  moveData.y = 0;
                }

                return moveData;
              })
            )
            .pipe(
              filter(
                ({ x, y }) => !this.validateDrag || this.validateDrag({ x, y })
              )
            )
            .pipe(takeUntil(merge(this.pointerUp, this.pointerDown)))
            .pipe(share());

          pointerMove.pipe(take(1)).subscribe(() => {
            pointerDownEvent.event.preventDefault();

            this.zone.run(() => {
              this.dragStart.next({ x: 0, y: 0 });
            });

            this.setCursor(this.dragCursor);

            this.draggableHelper.currentDrag.next(currentDrag);
          });

          pointerMove.pipe(takeLast(1)).subscribe(({ x, y }) => {
            this.zone.run(() => {
              this.dragEnd.next({ x, y });
            });
            currentDrag.complete();
            this.setCssTransform(null);
            if (this.ghostDragEnabled) {
              this.renderer.setStyle(
                this.element.nativeElement,
                'pointerEvents',
                null
              );
            }
          });

          return pointerMove;
        })
      )
      .pipe(share());

    merge(
      pointerDrag.pipe(take(1)).pipe(map(value => [, value])),
      pointerDrag.pipe(pairwise())
    )
      .pipe(
        filter(([previous, next]) => {
          if (!previous) {
            return true;
          }
          return previous.x !== next.x || previous.y !== next.y;
        })
      )
      .pipe(map(([previous, next]) => next))
      .subscribe(({ x, y, currentDrag, clientX, clientY }) => {
        this.zone.run(() => {
          this.dragging.next({ x, y });
        });
        if (this.ghostDragEnabled) {
          this.renderer.setStyle(
            this.element.nativeElement,
            'pointerEvents',
            'none'
          );
        }
        this.setCssTransform(`translate(${x}px, ${y}px)`);
        currentDrag.next({
          clientX,
          clientY,
          dropData: this.dropData
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dragAxis']) {
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
    this.setCursor(null);
  }

  private setCssTransform(value: string | null): void {
    if (this.ghostDragEnabled) {
      const transformAttributes = [
        'transform',
        '-webkit-transform',
        '-ms-transform',
        '-moz-transform',
        '-o-transform'
      ];
      transformAttributes.forEach(transformAttribute => {
        this.renderer.setStyle(
          this.element.nativeElement,
          transformAttribute,
          value
        );
      });
    }
  }

  private canDrag(): boolean {
    return this.dragAxis.x || this.dragAxis.y;
  }

  private setCursor(value: string | null): void {
    this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
  }

  private unsubscribeEventListeners(): void {
    Object.keys(this.eventListenerSubscriptions).forEach(type => {
      (this as any).eventListenerSubscriptions[type]();
      delete (this as any).eventListenerSubscriptions[type];
    });
  }
}
