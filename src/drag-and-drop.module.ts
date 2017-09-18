import { NgModule, ModuleWithProviders } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';
import { DraggableHelper } from './draggable-helper.provider';

@NgModule({
  declarations: [DraggableDirective, DroppableDirective],
  exports: [DraggableDirective, DroppableDirective]
})
export class DragAndDropModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DragAndDropModule,
      providers: [DraggableHelper]
    };
  }
}
