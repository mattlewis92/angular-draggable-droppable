import {Component} from '@angular/core';

@Component({
  selector: 'demo-app',
  template: `
    <div mwlDraggable dropData="foo">
      Drag me!
    </div>
    <div mwlDraggable dropData="bar" [dragSnapGrid]="{x: 100, y: 100}">
      I snap to a 100x100 grid
    </div>
    <div
      [class.dropOverActive]="dropOverActive"
      mwlDroppable
      (dragEnter)="dropOverActive = true"
      (dragLeave)="dropOverActive = false"
      (drop)="onDrop($event)">
      <span [hidden]="droppedData">Drop here</span>
      <span [hidden]="!droppedData">Item dropped here with data: "{{ droppedData }}"!</span>
    </div>
  `,
  styles: [`
    [mwlDraggable] {
      background-color: red;
      width: 200px;
      height: 200px;
      position: relative;
      z-index: 1;
      float: left;
      margin-right: 10px;
    }
    [mwlDroppable] {
      background-color: green;
      width: 400px;
      height: 400px;
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
    .dropOverActive {
      border: dashed 1px black;
      background-color: lightgreen;
    }
  `]
})
export class Demo {

  dropOverActive: boolean = false;

  droppedData: string = '';

  onDrop({dropData}: {dropData: any}): void {
    this.dropOverActive = false;
    this.droppedData = dropData;
    setTimeout(() => {
      this.droppedData = '';
    }, 2000);
  }

}
