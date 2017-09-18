import { NgModule, ModuleWithProviders } from '@angular/core';
import { Draggable } from './draggable.directive';
import { Droppable } from './droppable.directive';
import { DraggableHelper } from './draggableHelper.provider';

@NgModule({
  declarations: [Draggable, Droppable],
  exports: [Draggable, Droppable]
})
export class DragAndDropModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DragAndDropModule,
      providers: [DraggableHelper]
    };
  }
}
