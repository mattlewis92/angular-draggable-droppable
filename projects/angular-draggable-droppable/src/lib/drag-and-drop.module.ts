import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';

@NgModule({
  imports: [
    DraggableDirective,
    DroppableDirective,
    DraggableScrollContainerDirective,
  ],
  exports: [
    DraggableDirective,
    DroppableDirective,
    DraggableScrollContainerDirective,
  ],
})
export class DragAndDropModule {}
