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
  ViewContainerRef,
  Optional
} from '@angular/core';
import {
  Subject,
  Observable,
  merge,
  ReplaySubject,
  combineLatest,
  animationFrameScheduler,
  fromEvent,
  of
} from 'rxjs';
import {
  map,
  mergeMap,
  takeUntil,
  take,
  takeLast,
  pairwise,
  share,
  filter,
  count,
  startWith,
  auditTime,
  switchMap,
  tap
} from 'rxjs/operators';
import { CurrentDragData, DraggableHelper } from './draggable-helper.provider';
import { DOCUMENT } from '@angular/common';
import autoScroll from '@mattlewis92/dom-autoscroller';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
import { addClass, removeClass } from './util';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';

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

export interface DragPointerDownEvent extends Coordinates {}

export interface DragStartEvent {
  cancelDrag$: ReplaySubject<void>;
}

export interface DragMoveEvent extends Coordinates {}

export interface DragEndEvent extends Coordinates {
  dragCancelled: boolean;
}

export interface ValidateDragParams extends Coordinates {
  transform: {
    x: number;
    y: number;
  };
}

export type ValidateDrag = (params: ValidateDragParams) => boolean;

export interface GhostElementCreatedEvent {
  clientX: number;
  clientY: number;
  element: HTMLElement;
}

@Directive({
  selector: '[mwlDraggable]'
})
export class DraggableDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * an object of data you can pass to the drop event
   */
  @Input()
  dropData: any;

  /**
   * The axis along which the element is draggable
   */
  @Input()
  dragAxis: DragAxis = { x: true, y: true };

  /**
   * Snap all drags to an x / y grid
   */
  @Input()
  dragSnapGrid: SnapGrid = {};

  /**
   * Show a ghost element that shows the drag when dragging
   */
  @Input()
  ghostDragEnabled: boolean = true;

  /**
   * Show the original element when ghostDragEnabled is true
   */
  @Input()
  showOriginalElementWhileDragging: boolean = false;

  /**
   * Allow custom behaviour to control when the element is dragged
   */
  @Input()
  validateDrag: ValidateDrag;

  /**
   * The cursor to use when hovering over a draggable element
   */
  @Input()
  dragCursor: string = '';

  /**
   * The css class to apply when the element is being dragged
   */
  @Input()
  dragActiveClass: string;

  /**
   * The element the ghost element will be appended to. Default is next to the dragged element
   */
  @Input()
  ghostElementAppendTo: HTMLElement;

  /**
   * An ng-template to be inserted into the parent element of the ghost element. It will overwrite any child nodes.
   */
  @Input()
  ghostElementTemplate: TemplateRef<any>;

  /**
   * Amount of milliseconds to wait on touch devices before starting to drag the element (so that you can scroll the page by touching a draggable element)
   */
  @Input()
  touchStartLongPress: { delay: number; delta: number };

  /**
   * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
   */
  @Output()
  dragPointerDown = new EventEmitter<DragPointerDownEvent>();

  /**
   * Called when the element has started to be dragged.
   * Only called after at least one mouse or touch move event.
   * If you call $event.cancelDrag$.emit() it will cancel the current drag
   */
  @Output()
  dragStart = new EventEmitter<DragStartEvent>();

  /**
   * Called after the ghost element has been created
   */
  @Output()
  ghostElementCreated = new EventEmitter<GhostElementCreatedEvent>();

  /**
   * Called when the element is being dragged
   */
  @Output()
  dragging = new EventEmitter<DragMoveEvent>();

  /**
   * Called after the element is dragged
   */
  @Output()
  dragEnd = new EventEmitter<DragEndEvent>();

  /**
   * @hidden
   */
  private destroy$ = new Subject();

  /**
   * @hidden
   */
  constructor(
    private element: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private draggableHelper: DraggableHelper,
    private zone: NgZone,
    private vcr: ViewContainerRef,
    @Optional() private scrollContainer: DraggableScrollContainerDirective,
    @Inject(DOCUMENT) private document: any,
    private dragDrop: DragDrop
  ) {}

  ngOnInit(): void {
    const dragRef = this.dragDrop.createDrag(this.element);

    let start: { x: number; y: number };
    fromEvent<MouseEvent>(this.element.nativeElement, 'mousedown')
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        this.dragPointerDown.next({ x: 0, y: 0 });
        start = {
          x: event.clientX,
          y: event.clientY
        };
      });

    dragRef.constrainPosition = (point: { x: number; y: number }) => {
      const moveData = {
        x: point.x - start.x,
        y: point.y - start.y
      };
      if (this.dragSnapGrid.x) {
        moveData.x =
          Math.round(moveData.x / this.dragSnapGrid.x) * this.dragSnapGrid.x;
      }

      if (this.dragSnapGrid.y) {
        moveData.y =
          Math.round(moveData.y / this.dragSnapGrid.y) * this.dragSnapGrid.y;
      }

      moveData.x += start.x;
      moveData.y += start.y;

      return moveData;
    };

    dragRef.started
      .pipe(
        switchMap(() => {
          const currentDrag = new Subject<CurrentDragData>();
          const cancelDrag$ = new ReplaySubject<void>();
          this.dragStart.emit({ cancelDrag$ });
          this.draggableHelper.currentDrag.next(currentDrag);
          return combineLatest([dragRef.moved, of(currentDrag)]).pipe(
            takeUntil(
              dragRef.ended.pipe(
                tap(() => {
                  currentDrag.complete();
                  dragRef.reset();
                })
              )
            )
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(([moveEvent, currentDrag]) => {
        currentDrag.next({
          clientX: moveEvent.pointerPosition.x,
          clientY: moveEvent.pointerPosition.y,
          dropData: this.dropData
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
