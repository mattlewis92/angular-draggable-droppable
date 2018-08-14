import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragAndDropModule } from 'angular-draggable-droppable';

import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, DragAndDropModule],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
