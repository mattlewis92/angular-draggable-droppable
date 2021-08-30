import {
  Directive,
  OnInit,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  NgZone,
  Input,
  Renderer2,
  Optional,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, pairwise, filter, map } from 'rxjs/operators';
import { DraggableHelper } from './draggable-helper.provider';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
import { addClass, removeClass } from './util';

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

export interface DropEvent<T = any> {
  dropData: T;
}

export interface ValidateDropParams {
  /**
   * ClientX value of the mouse location where the drop occurred
   */
  clientX: number;
  /**
   * ClientY value of the mouse location where the drop occurred
   */
  clientY: number;
  /**
   * The target of the event where the drop occurred
   */
  target: EventTarget;
}

export type ValidateDrop = (params: ValidateDropParams) => boolean;

@Directive({
  selector: '[mwlDroppable]',
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
   * Allow custom behaviour to control when the element is dropped
   */
  @Input() validateDrop: ValidateDrop;

  /**
   * Called when a draggable element starts overlapping the element
   */
  @Output() dragEnter = new EventEmitter<DropEvent>();

  /**
   * Called when a draggable element stops overlapping the element
   */
  @Output() dragLeave = new EventEmitter<DropEvent>();

  /**
   * Called when a draggable element is moved over the element
   */
  @Output() dragOver = new EventEmitter<DropEvent>();

  /**
   * Called when a draggable element is dropped on this element
   */
  @Output() drop = new EventEmitter<DropEvent>(); // eslint-disable-line  @angular-eslint/no-output-native

  currentDragSubscription: Subscription;

  constructor(
    private element: ElementRef<HTMLElement>,
    private draggableHelper: DraggableHelper,
    private zone: NgZone,
    private renderer: Renderer2,
    @Optional() private scrollContainer: DraggableScrollContainerDirective
  ) {}

  ngOnInit() {
    this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe(
      (drag$) => {
        addClass(this.renderer, this.element, this.dragActiveClass);
        const droppableElement: {
          rect?: ClientRect;
          updateCache: boolean;
          scrollContainerRect?: ClientRect;
        } = {
          updateCache: true,
        };

        const deregisterScrollListener = this.renderer.listen(
          this.scrollContainer
            ? this.scrollContainer.elementRef.nativeElement
            : 'window',
          'scroll',
          () => {
            droppableElement.updateCache = true;
          }
        );

        let currentDragDropData: any;
        const overlaps$ = drag$.pipe(
          map(({ clientX, clientY, dropData, target }) => {
            currentDragDropData = dropData;
            if (droppableElement.updateCache) {
              droppableElement.rect =
                this.element.nativeElement.getBoundingClientRect();
              if (this.scrollContainer) {
                droppableElement.scrollContainerRect =
                  this.scrollContainer.elementRef.nativeElement.getBoundingClientRect();
              }
              droppableElement.updateCache = false;
            }
            const isWithinElement = isCoordinateWithinRectangle(
              clientX,
              clientY,
              droppableElement.rect as ClientRect
            );

            const isDropAllowed =
              !this.validateDrop ||
              this.validateDrop({ clientX, clientY, target });

            if (droppableElement.scrollContainerRect) {
              return (
                isWithinElement &&
                isDropAllowed &&
                isCoordinateWithinRectangle(
                  clientX,
                  clientY,
                  droppableElement.scrollContainerRect as ClientRect
                )
              );
            } else {
              return isWithinElement && isDropAllowed;
            }
          })
        );

        const overlapsChanged$ = overlaps$.pipe(distinctUntilChanged());

        let dragOverActive: boolean; // TODO - see if there's a way of doing this via rxjs

        overlapsChanged$
          .pipe(filter((overlapsNow) => overlapsNow))
          .subscribe(() => {
            dragOverActive = true;
            addClass(this.renderer, this.element, this.dragOverClass);
            this.zone.run(() => {
              this.dragEnter.next({
                dropData: currentDragDropData,
              });
            });
          });

        overlaps$.pipe(filter((overlapsNow) => overlapsNow)).subscribe(() => {
          this.zone.run(() => {
            this.dragOver.next({
              dropData: currentDragDropData,
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
            removeClass(this.renderer, this.element, this.dragOverClass);
            this.zone.run(() => {
              this.dragLeave.next({
                dropData: currentDragDropData,
              });
            });
          });

        drag$.subscribe({
          complete: () => {
            deregisterScrollListener();
            removeClass(this.renderer, this.element, this.dragActiveClass);
            if (dragOverActive) {
              removeClass(this.renderer, this.element, this.dragOverClass);
              this.zone.run(() => {
                this.drop.next({
                  dropData: currentDragDropData,
                });
              });
            }
          },
        });
      }
    );
  }

  ngOnDestroy() {
    if (this.currentDragSubscription) {
      this.currentDragSubscription.unsubscribe();
    }
  }
}
