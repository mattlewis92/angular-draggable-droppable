import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragAndDropModule } from '../src';
import { Demo } from './demo.component';

@NgModule({
  declarations: [Demo],
  imports: [BrowserModule, DragAndDropModule.forRoot()],
  bootstrap: [Demo],
  providers: []
})
export class DemoModule {}
