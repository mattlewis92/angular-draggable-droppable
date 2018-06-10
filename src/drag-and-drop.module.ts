import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';

@NgModule({
  declarations: [DraggableDirective, DroppableDirective],
  exports: [DraggableDirective, DroppableDirective]
})
export class DragAndDropModule {}
