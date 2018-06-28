import { Component } from '@angular/core';
import { DropEvent } from '../src';

@Component({
  selector: 'mwl-demo-app',
  template: `
    <div mwlDraggable dropData="foo" dragActiveClass="drag-active">
      Drag me!
    </div>
    <div mwlDraggable dropData="bar" dragActiveClass="drag-active" [dragSnapGrid]="{x: 100, y: 100}">
      I snap to a 100 x 100 grid
    </div>
    <div
      mwlDroppable
      (drop)="onDrop($event)"
      dragOverClass="drop-over-active">
      <span [hidden]="droppedData">Drop here</span>
      <span [hidden]="!droppedData">Item dropped here with data: "{{ droppedData }}"!</span>
    </div>
  `,
  styles: [
    `
      [mwlDraggable] {
        background-color: red;
        width: 200px;
        height: 200px;
        position: relative;
        z-index: 2;
        float: left;
        margin-right: 10px;
        cursor: move;
      }
      [mwlDroppable] {
        background-color: green;
        width: 400px;
        height: 400px;
        z-index: 1;
        position: relative;
        top: 50px;
        left: 100px;
      }
      [mwlDraggable],
      [mwlDroppable] {
        color: white;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .drop-over-active {
        border: dashed 1px black;
        background-color: lightgreen;
      }
      .drag-active {
        z-index: 3;
      }
    `
  ]
})
export class DemoComponent {
  droppedData: string = '';

  onDrop({ dropData }: DropEvent<string>): void {
    this.droppedData = dropData;
    setTimeout(() => {
      this.droppedData = '';
    }, 2000);
  }
}
