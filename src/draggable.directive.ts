import {Directive, HostListener, OnInit, ElementRef, Renderer, Output, EventEmitter, Input, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/share';
import {DraggableHelper} from './draggableHelper.provider';

export type Coordinates = {x: number, y: number};

export type DragAxis = {x: boolean, y: boolean};

export type SnapGrid = {x?: number, y?: number};

export type ValidateDrag = (coordinates: Coordinates) => boolean;

const MOVE_CURSOR: string = 'move';

@Directive({
  selector: '[mwlDraggable]'
})
export class Draggable implements OnInit, OnDestroy {

  @Input() dropData: any;

  @Input() dragAxis: DragAxis = {x: true, y: true};

  @Input() dragSnapGrid: SnapGrid = {};

  @Input() ghostDragEnabled: boolean = true;

  @Input() validateDrag: ValidateDrag;

  @Output() dragStart: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output() dragging: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output() dragEnd: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  public mouseDown: Subject<any> = new Subject();

  public mouseMove: Subject<any> = new Subject();

  public mouseUp: Subject<any> = new Subject();

  constructor(public element: ElementRef, private renderer: Renderer, private draggableHelper: DraggableHelper) {}

  ngOnInit(): void {

    const mouseDrag: Observable<any> = this.mouseDown
      .filter(() => this.canDrag())
      .flatMap((mouseDownEvent: MouseEvent) => {

        this.dragStart.next({x: 0, y: 0});
        this.setCursor(MOVE_CURSOR);

        if (this.ghostDragEnabled) {
          this.renderer.setElementStyle(this.element.nativeElement, 'pointerEvents', 'none');
        }

        const currentDrag: Subject<any> = new Subject();

        this.draggableHelper.currentDrag.next(currentDrag);

        const mouseMove: Observable<Coordinates> = this.mouseMove
          .map((mouseMoveEvent: MouseEvent) => {

            mouseMoveEvent.preventDefault();

            return {
              currentDrag,
              x: mouseMoveEvent.clientX - mouseDownEvent.clientX,
              y: mouseMoveEvent.clientY - mouseDownEvent.clientY,
              clientX: mouseMoveEvent.clientX,
              clientY: mouseMoveEvent.clientY
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
          .takeUntil(Observable.merge(this.mouseUp, this.mouseDown));

        mouseMove.takeLast(1).subscribe(({x, y}) => {
          this.dragEnd.next({x, y});
          currentDrag.complete();
          this.setCssTransform(null);
          if (this.ghostDragEnabled) {
            this.renderer.setElementStyle(this.element.nativeElement, 'pointerEvents', null);
          }
        });

        return mouseMove;

      })
      .share();

    Observable
      .merge(
        mouseDrag.take(1).map(value => [, value]),
        mouseDrag.pairwise()
      )
      .filter(([previous, next]) => {
        if (!previous) {
          return true;
        }
        return previous.x !== next.x || previous.y !== next.y;
      })
      .map(([previous, next]) => next)
      .subscribe(({x, y, currentDrag, clientX, clientY}) => {
        this.dragging.next({x, y});
        this.setCssTransform(`translate(${x}px, ${y}px)`);
        currentDrag.next({
          clientX,
          clientY,
          dropData: this.dropData
        });
      });

  }

  ngOnDestroy(): void {
    this.mouseDown.complete();
    this.mouseMove.complete();
    this.mouseUp.complete();
  }

  /**
   * @private
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.mouseDown.next(event);
  }

  /**
   * @private
   */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseMove.next(event);
  }

  /**
   * @private
   */
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.mouseUp.next(event);
  }

  /**
   * @private
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.canDrag()) {
      this.setCursor(MOVE_CURSOR);
    }
  }

  /**
   * @private
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.setCursor(null);
  }

  private setCssTransform(value: string): void {
    if (this.ghostDragEnabled) {
      this.renderer.setElementStyle(this.element.nativeElement, 'transform', value);
      this.renderer.setElementStyle(this.element.nativeElement, '-webkit-transform', value);
      this.renderer.setElementStyle(this.element.nativeElement, '-ms-transform', value);
      this.renderer.setElementStyle(this.element.nativeElement, '-moz-transform', value);
      this.renderer.setElementStyle(this.element.nativeElement, '-o-transform', value);
    }
  }

  private canDrag(): boolean {
    return this.dragAxis.x || this.dragAxis.y;
  }

  private setCursor(value: string): void {
    this.renderer.setElementStyle(this.element.nativeElement, 'cursor', value);
  }

}