import {NgModule} from '@angular/core';
import {Draggable} from './draggable.directive';

@NgModule({
  declarations: [
    Draggable
  ],
  exports: [
    Draggable
  ]
})
export class DragAndDropModule {}