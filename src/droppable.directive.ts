import {
  Directive,
  OnInit,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  NgZone,
  Input,
  Renderer2
} from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, pairwise, filter, map } from 'rxjs/operators';
import { DraggableHelper } from './draggable-helper.provider';

function isCoordinateWithinRectangle(
  clientX: number,
  clientY: number,
  rect: ClientRect
): boolean {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

export interface DropData {
  dropData: any;
}

@Directive({
  selector: '[mwlDroppable]'
})
export class DroppableDirective implements OnInit, OnDestroy {
  /**
   * Added to the element when an element is dragged over it
   */
  @Input() dragOverClass: string;

  /**
   * Added to the element any time a draggable element is being dragged
   */
  @Input() dragActiveClass: string;

  /**
   * Called when a draggable element starts overlapping the element
   */
  @Output() dragEnter = new EventEmitter<DropData>();

  /**
   * Called when a draggable element stops overlapping the element
   */
  @Output() dragLeave = new EventEmitter<DropData>();

  /**
   * Called when a draggable element is moved over the element
   */
  @Output() dragOver = new EventEmitter<DropData>();

  /**
   * Called when a draggable element is dropped on this element
   */
  @Output() drop = new EventEmitter<DropData>();

  currentDragSubscription: Subscription;

  constructor(
    private element: ElementRef<HTMLElement>,
    private draggableHelper: DraggableHelper,
    private zone: NgZone,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe(
      drag$ => {
        this.renderer.addClass(
          this.element.nativeElement,
          this.dragActiveClass
        );
        let droppableRectangle = this.element.nativeElement.getBoundingClientRect();

        /* istanbul ignore next */
        const deregisterScrollListener = this.renderer.listen(
          'window',
          'scroll',
          () => {
            droppableRectangle = this.element.nativeElement.getBoundingClientRect();
          }
        );

        let currentDragDropData: any;
        const overlaps$ = drag$.pipe(
          map(({ clientX, clientY, dropData }) => {
            currentDragDropData = dropData;
            return isCoordinateWithinRectangle(
              clientX,
              clientY,
              droppableRectangle
            );
          })
        );

        const overlapsChanged$ = overlaps$.pipe(distinctUntilChanged());

        let dragOverActive: boolean; // TODO - see if there's a way of doing this via rxjs

        overlapsChanged$
          .pipe(filter(overlapsNow => overlapsNow))
          .subscribe(() => {
            dragOverActive = true;
            this.renderer.addClass(
              this.element.nativeElement,
              this.dragOverClass
            );
            this.zone.run(() => {
              this.dragEnter.next({
                dropData: currentDragDropData
              });
            });
          });

        overlaps$.pipe(filter(overlapsNow => overlapsNow)).subscribe(() => {
          this.zone.run(() => {
            this.dragOver.next({
              dropData: currentDragDropData
            });
          });
        });

        overlapsChanged$
          .pipe(
            pairwise(),
            filter(([didOverlap, overlapsNow]) => didOverlap && !overlapsNow)
          )
          .subscribe(() => {
            dragOverActive = false;
            this.renderer.removeClass(
              this.element.nativeElement,
              this.dragOverClass
            );
            this.zone.run(() => {
              this.dragLeave.next({
                dropData: currentDragDropData
              });
            });
          });

        drag$.subscribe({
          complete: () => {
            deregisterScrollListener();
            this.renderer.removeClass(
              this.element.nativeElement,
              this.dragActiveClass
            );
            if (dragOverActive) {
              this.renderer.removeClass(
                this.element.nativeElement,
                this.dragOverClass
              );
              this.zone.run(() => {
                this.drop.next({
                  dropData: currentDragDropData
                });
              });
            }
          }
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.currentDragSubscription.unsubscribe();
  }
}
