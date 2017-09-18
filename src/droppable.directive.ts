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
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/filter';
import { DraggableHelper } from './draggableHelper.provider';

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

export type DropData = { dropData: any };

@Directive({
  selector: '[mwlDroppable]'
})
export class Droppable implements OnInit, OnDestroy {
  @Output() dragEnter: EventEmitter<DropData> = new EventEmitter<DropData>();

  @Output() dragLeave: EventEmitter<DropData> = new EventEmitter<DropData>();

  @Output() dragOver: EventEmitter<DropData> = new EventEmitter<DropData>();

  @Output() drop: EventEmitter<DropData> = new EventEmitter<DropData>();

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
        const overlaps: Observable<
          boolean
        > = drag.map(({ clientX, clientY, dropData }) => {
          currentDragDropData = dropData;
          return isCoordinateWithinRectangle(
            clientX,
            clientY,
            droppableRectangle
          );
        });

        const overlapsChanged: Observable<
          boolean
        > = overlaps.distinctUntilChanged();

        let dragOverActive: boolean; // TODO - see if there's a way of doing this via rxjs

        overlapsChanged.filter(overlapsNow => overlapsNow).subscribe(() => {
          dragOverActive = true;
          this.zone.run(() => {
            this.dragEnter.next({
              dropData: currentDragDropData
            });
          });
        });

        overlaps.filter(overlapsNow => overlapsNow).subscribe(() => {
          this.zone.run(() => {
            this.dragOver.next({
              dropData: currentDragDropData
            });
          });
        });

        overlapsChanged
          .pairwise()
          .filter(([didOverlap, overlapsNow]) => didOverlap && !overlapsNow)
          .subscribe(() => {
            dragOverActive = false;
            this.zone.run(() => {
              this.dragLeave.next({
                dropData: currentDragDropData
              });
            });
          });

        drag.flatMap(() => overlaps).subscribe({
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
