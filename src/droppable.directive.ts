import {Directive, OnInit, ElementRef, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/filter';
import {DraggableHelper} from './draggableHelper.provider';

function isOverlapping(rect1: ClientRect, rect2: ClientRect): boolean {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

export type DropData = {dropData: any};

@Directive({
  selector: '[mwlDroppable]'
})
export class Droppable implements OnInit, OnDestroy {

  @Output() dragEnter: EventEmitter<DropData> = new EventEmitter<DropData>();

  @Output() dragLeave: EventEmitter<DropData> = new EventEmitter<DropData>();

  @Output() dragOver: EventEmitter<DropData> = new EventEmitter<DropData>();

  @Output() drop: EventEmitter<DropData> = new EventEmitter<DropData>();

  currentDragSubscription: Subscription;

  constructor(private element: ElementRef, private draggableHelper: DraggableHelper) {}

  ngOnInit(): void {

    this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe((drag: Subject<{rectangle: ClientRect, dropData: any}>) => {

      const droppableRectangle: ClientRect = this.element.nativeElement.getBoundingClientRect();

      let currentDragDropData: any;
      const overlaps: Observable<boolean> = drag.map(({rectangle: draggableRectangle, dropData}) => {
        currentDragDropData = dropData;
        return isOverlapping(draggableRectangle, droppableRectangle);
      });

      const overlapsChanged: Observable<boolean> = overlaps.distinctUntilChanged();

      let dragOverActive: boolean; // TODO - see if there's a way of doing this via rxjs

      overlapsChanged.filter(overlapsNow => overlapsNow).subscribe(() => {
        dragOverActive = true;
        this.dragEnter.next({
          dropData: currentDragDropData
        });
      });

      overlaps.filter(overlapsNow => overlapsNow).subscribe(() => {
        this.dragOver.next({
          dropData: currentDragDropData
        });
      });

      overlapsChanged
        .pairwise()
        .filter(([didOverlap, overlapsNow]) => didOverlap && !overlapsNow)
        .subscribe(() => {
          dragOverActive = false;
          this.dragLeave.next({
            dropData: currentDragDropData
          });
        });

      drag.flatMap(() => overlaps).subscribe({
        complete: () => {
          if (dragOverActive) {
            this.drop.next({
              dropData: currentDragDropData
            });
          }
        }
      });

    });

  }

  ngOnDestroy(): void {
    this.currentDragSubscription.unsubscribe();
  }

}