import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragAndDropModule } from '../src';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, DragAndDropModule.forRoot()],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
