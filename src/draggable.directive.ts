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
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/share';
import {DraggableHelper} from './draggableHelper.provider';
import {Subscription} from 'rxjs/Subscription';

export type Coordinates = { x: number, y: number };

export type DragAxis = { x: boolean, y: boolean };

export type SnapGrid = { x?: number, y?: number };

export type ValidateDrag = (coordinates: Coordinates) => boolean;

export interface PointerEvent {
  clientX: number;
  clientY: number;
  event: MouseEvent | TouchEvent;
}

export class DragScrollDirection {
  static UP: number = -1;
  static DOWN: number = 1;
  static LEFT: number = -1;
  static RIGHT: number = 1;
}

const MOVE_CURSOR: string = 'move';

@Directive({
  selector: '[mwlDraggable]'
})
export class Draggable implements OnInit, OnChanges, OnDestroy {

  @Input() dropData: any;

  @Input() dragAxis: DragAxis = {x: true, y: true};

  @Input() dragSnapGrid: SnapGrid = {};

  @Input() ghostDragEnabled: boolean = true;

  @Input() validateDrag: ValidateDrag;

  @Output() dragStart: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output() dragging: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output() dragEnd: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

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

  scroll: {
    container: any;
    y: number;
    x: number;
  };

  private eventListenerSubscriptions: {
    mousemove?: Function,
    mousedown?: Function,
    mouseup?: Function,
    mouseenter?: Function,
    mouseleave?: Function,
    touchstart?: Function,
    touchmove?: Function,
    touchend?: Function,
    touchcancel?: Function
  } = {};

  /**
   * @hidden
   */
  constructor(public element: ElementRef,
              private renderer: Renderer2,
              private draggableHelper: DraggableHelper,
              private zone: NgZone) {
  }

  ngOnInit(): void {

    this.scroll = {
      container: null,
      y: 0,
      x: 0
    };

    let startingScrollTop: number = 0;
    let startingScrollLeft: number = 0;

    this.checkEventListeners();

    const pointerDrag: Observable<any> = this.pointerDown
      .filter(() => this.canDrag())
      .flatMap((pointerDownEvent: PointerEvent) => {

        pointerDownEvent.event.preventDefault();

        this.zone.run(() => {
          this.dragStart.next({x: 0, y: 0});
        });

        if (!this.scroll.container) {
          this.scroll.container = this.draggableHelper.getScrollParent(this.element.nativeElement);
        }

        if (this.scroll.container) {
          startingScrollTop = this.scroll.container.scrollTop;
          startingScrollLeft = this.scroll.container.scrollLeft;
        }

        this.setCursor(MOVE_CURSOR);

        const currentDrag: Subject<any> = new Subject();

        this.draggableHelper.currentDrag.next(currentDrag);

        const pointerMove: Observable<Coordinates> = this.pointerMove
          .map((pointerMoveEvent: PointerEvent) => {

            pointerMoveEvent.event.preventDefault();

            let scrollOffsetTop: number = 0;
            let scrollOffsetLeft: number = 0;

            // If we have a scroll element calculate it's offset including the scroll
            if (this.scroll.container) {
              if (typeof this.scroll.container.offsetTop !== 'undefined') {
                scrollOffsetTop = this.scroll.container.clientTop + (this.scroll.container.scrollTop - startingScrollTop);
                scrollOffsetLeft = this.scroll.container.clientLeft + (this.scroll.container.scrollLeft - startingScrollLeft);
              }
            }

            return {
              currentDrag,
              x: pointerMoveEvent.clientX - pointerDownEvent.clientX + scrollOffsetLeft,
              y: pointerMoveEvent.clientY - pointerDownEvent.clientY + scrollOffsetTop,
              clientX: pointerMoveEvent.clientX + scrollOffsetLeft,
              clientY: pointerMoveEvent.clientY + scrollOffsetTop
            };
          })
          .map((moveData: Coordinates) => {

            if (this.dragSnapGrid.x) {
              moveData.x = Math.floor(moveData.x / this.dragSnapGrid.x) * this.dragSnapGrid.x;
            }

            if (this.dragSnapGrid.y) {
              moveData.y = Math.floor(moveData.y / this.dragSnapGrid.y) * this.dragSnapGrid.y;
            }

            return moveData;
          })
          .map((moveData: Coordinates) => {

            if (!this.dragAxis.x) {
              moveData.x = 0;
            }

            if (!this.dragAxis.y) {
              moveData.y = 0;
            }

            return moveData;
          })
          .filter(({x, y}) => !this.validateDrag || this.validateDrag({x, y}))
          .takeUntil(Observable.merge(this.pointerUp, this.pointerDown));

        pointerMove.takeLast(1).subscribe(({x, y}) => {
          this.zone.run(() => {
            this.dragEnd.next({x, y});
          });
          currentDrag.complete();
          this.setCssTransform(null);
          if (this.ghostDragEnabled) {
            this.renderer.setStyle(this.element.nativeElement, 'pointerEvents', null);
          }
        });

        return pointerMove;

      })
      .share();

    const dragScroll: any = Observable
      .interval(1)
      .map(() => {
        if (typeof this.scroll.container === 'undefined' || !this.scroll.y && !this.scroll.x) return;

        let x: number = 0;
        let y: number = 0;

        if (this.scroll.y === DragScrollDirection.DOWN) {
          y = 5;
        } else if (this.scroll.y === DragScrollDirection.UP) {
          y = -5;
        } else {
          y = 0;
        }

        if (this.scroll.x === DragScrollDirection.LEFT) {
          x = -5;
        } else if (this.scroll.x === DragScrollDirection.RIGHT) {
          x = 5;
        } else {
          x = 0;
        }
        if (typeof this.scroll.container.scrollBy === 'function') {
          this.scroll.container.scrollBy(x, y);
        }
      })
      .takeUntil(this.pointerUp)
      .share();

    let dragScrollSubscription: Subscription;

    Observable
      .merge(
        pointerDrag.take(1).map(value => [, value]),
        pointerDrag.pairwise()
      )
      .filter(([previous, next]) => {
        if (!previous) {
          return true;
        }
        return previous.x !== next.x || previous.y !== next.y;
      })
      .map(([previous, next]) => next)
      .subscribe(({x, y, currentDrag, clientX, clientY}) => {
        this.zone.run(() => {
          this.dragging.next({x, y});
        });
        if (this.ghostDragEnabled) {
          this.renderer.setStyle(this.element.nativeElement, 'pointerEvents', 'none');
        }
        this.setCssTransform(`translate(${x}px, ${y}px)`);
        currentDrag.next({
          clientX,
          clientY,
          dropData: this.dropData
        });

        if (this.scroll.container) {
          let containerTop: number = this.scroll.container.offsetTop || this.scroll.container.pageYOffset || 0;
          let containerBottom: number = this.scroll.container.offsetTop + this.scroll.container.clientHeight;
          let containerScrollTop: number = this.scroll.container.scrollTop || this.scroll.container.scrollY || 0;

          if (clientY > containerBottom + (containerScrollTop - startingScrollTop) - 50) {
            this.scroll.y = DragScrollDirection.DOWN;
            if (!dragScrollSubscription) {
              dragScrollSubscription = dragScroll.subscribe();
            }
          } else if (clientY < containerTop + (containerScrollTop - startingScrollTop) + 50) {
            this.scroll.y = DragScrollDirection.UP;

            if (!dragScrollSubscription) {
              dragScrollSubscription = dragScroll.subscribe();
            }
          } else {
            if (dragScrollSubscription) {
              dragScrollSubscription.unsubscribe();
              dragScrollSubscription = null;
              this.scroll.y = null;
            }
          }
        }
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
    const hasEventListeners: boolean = Object.keys(this.eventListenerSubscriptions).length > 0;

    if (canDrag && !hasEventListeners) {

      this.zone.runOutsideAngular(() => {

        this.eventListenerSubscriptions.mousedown = this.renderer.listen(this.element.nativeElement,
          'mousedown', (event: MouseEvent) => {
            this.onMouseDown(event);
          });

        this.eventListenerSubscriptions.mouseup = this.renderer.listen('document',
          'mouseup', (event: MouseEvent) => {
            this.onMouseUp(event);
          });

        this.eventListenerSubscriptions.touchstart = this.renderer.listen(this.element.nativeElement,
          'touchstart', (event: TouchEvent) => {
            this.onTouchStart(event);
          });

        this.eventListenerSubscriptions.touchend = this.renderer.listen('document',
          'touchend', (event: TouchEvent) => {
            this.onTouchEnd(event);
          });

        this.eventListenerSubscriptions.touchcancel = this.renderer.listen('document',
          'touchcancel', (event: TouchEvent) => {
            this.onTouchEnd(event);
          });

        this.eventListenerSubscriptions.mouseenter = this.renderer.listen(this.element.nativeElement,
          'mouseenter', () => {
            this.onMouseEnter();
          });

        this.eventListenerSubscriptions.mouseleave = this.renderer.listen(this.element.nativeElement,
          'mouseleave', () => {
            this.onMouseLeave();
          });

      });

    } else if (!canDrag && hasEventListeners) {
      this.unsubscribeEventListeners();
    }

  }

  private onMouseDown(event: MouseEvent): void {
    if (!this.eventListenerSubscriptions.mousemove) {
      this.eventListenerSubscriptions.mousemove = this.renderer.listen('document',
        'mousemove', (event: MouseEvent) => {
          this.pointerMove.next({event, clientX: event.clientX, clientY: event.clientY});
        });
    }
    this.pointerDown.next({event, clientX: event.clientX, clientY: event.clientY});
  }

  private onMouseUp(event: MouseEvent): void {
    if (this.eventListenerSubscriptions.mousemove) {
      this.eventListenerSubscriptions.mousemove();
      delete this.eventListenerSubscriptions.mousemove;
    }
    this.pointerUp.next({event, clientX: event.clientX, clientY: event.clientY});
  }

  private onTouchStart(event: TouchEvent): void {
    if (!this.eventListenerSubscriptions.touchmove) {
      this.eventListenerSubscriptions.touchmove = this.renderer.listen('document', 'touchmove', (event: TouchEvent) => {
        this.pointerMove.next({
          event,
          clientX: event.targetTouches[0].clientX,
          clientY: event.targetTouches[0].clientY
        });
      });
    }
    this.pointerDown.next({event, clientX: event.touches[0].clientX, clientY: event.touches[0].clientY});
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
    this.setCursor(MOVE_CURSOR);
  }

  private onMouseLeave(): void {
    this.setCursor(null);
  }

  private setCssTransform(value: string): void {
    if (this.ghostDragEnabled) {
      this.renderer.setStyle(this.element.nativeElement, 'transform', value);
      this.renderer.setStyle(this.element.nativeElement, '-webkit-transform', value);
      this.renderer.setStyle(this.element.nativeElement, '-ms-transform', value);
      this.renderer.setStyle(this.element.nativeElement, '-moz-transform', value);
      this.renderer.setStyle(this.element.nativeElement, '-o-transform', value);
    }
  }

  private canDrag(): boolean {
    return this.dragAxis.x || this.dragAxis.y;
  }

  private setCursor(value: string): void {
    this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
  }

  private unsubscribeEventListeners(): void {
    Object.keys(this.eventListenerSubscriptions).forEach((type: string) => {
      this.eventListenerSubscriptions[type]();
      delete this.eventListenerSubscriptions[type];
    });
  }
}