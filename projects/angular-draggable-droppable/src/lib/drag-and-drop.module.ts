import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    DraggableDirective,
    DroppableDirective,
    DraggableScrollContainerDirective
  ],
  exports: [
    DraggableDirective,
    DroppableDirective,
    DraggableScrollContainerDirective
  ],
  imports: [DragDropModule]
})
export class DragAndDropModule {}
