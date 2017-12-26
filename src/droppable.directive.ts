import {
  Directive,
  OnInit,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  NgZone
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { pairwise } from 'rxjs/operators/pairwise';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
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
    private element: ElementRef,
    private draggableHelper: DraggableHelper,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    interface CurrentDragData {
      clientX: number;
      clientY: number;
      dropData: any;
    }

    this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe(
      (drag: Subject<CurrentDragData>) => {
        const droppableRectangle: ClientRect = this.element.nativeElement.getBoundingClientRect();

        let currentDragDropData: any;
        const overlaps = drag.pipe(
          map(({ clientX, clientY, dropData }) => {
            currentDragDropData = dropData;
            return isCoordinateWithinRectangle(
              clientX,
              clientY,
              droppableRectangle
            );
          })
        );

        const overlapsChanged = overlaps.pipe(distinctUntilChanged());

        let dragOverActive: boolean; // TODO - see if there's a way of doing this via rxjs

        overlapsChanged
          .pipe(filter(overlapsNow => overlapsNow))
          .subscribe(() => {
            dragOverActive = true;
            this.zone.run(() => {
              this.dragEnter.next({
                dropData: currentDragDropData
              });
            });
          });

        overlaps.pipe(filter(overlapsNow => overlapsNow)).subscribe(() => {
          this.zone.run(() => {
            this.dragOver.next({
              dropData: currentDragDropData
            });
          });
        });

        overlapsChanged
          .pipe(pairwise())
          .pipe(
            filter(([didOverlap, overlapsNow]) => didOverlap && !overlapsNow)
          )
          .subscribe(() => {
            dragOverActive = false;
            this.zone.run(() => {
              this.dragLeave.next({
                dropData: currentDragDropData
              });
            });
          });

        drag.pipe(mergeMap(() => overlaps)).subscribe({
          complete: () => {
            if (dragOverActive) {
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
