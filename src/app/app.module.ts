import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DraggableDroppableModule } from '../../projects/draggable-droppable/src/lib/draggable-droppable.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, DraggableDroppableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
