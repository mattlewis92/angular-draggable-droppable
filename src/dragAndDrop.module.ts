import {NgModule} from '@angular/core';
import {Draggable} from './draggable.directive';
import {Droppable} from './droppable.directive';
import {DraggableHelper} from './draggableHelper.provider';

@NgModule({
  declarations: [
    Draggable,
    Droppable
  ],
  exports: [
    Draggable,
    Droppable
  ],
  providers: [
    DraggableHelper
  ]
})
export class DragAndDropModule {}