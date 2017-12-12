import {Component} from '@angular/core';

@Component({
  selector: 'demo-app',
  template: `
      <div class="scroll-container">
          <div mwlDraggable dropData="foo">
              Drag me!
          </div>
          <div mwlDraggable dropData="bar" [dragSnapGrid]="{x: 100, y: 100}">
              I snap to a 100 x 100 grid
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
      </div>
      <div mwlDraggable dropData="foo">
          Drag me!
      </div>
      <div mwlDraggable dropData="bar" [dragSnapGrid]="{x: 100, y: 100}">
          I snap to a 100 x 100 grid
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
          top: 800px;
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

      .scroll-container {
          position: relative;
          height: 400px;
          overflow: auto;
      }

      .scroll-container:before {
          position: absolute;
          width: 100%;
          height: 50px;
          top: 0;
          left: 0;
          background: rgba(255, 0, 0, .5);
      }

      .scroll-container:after {
          position: absolute;
          width: 100%;
          height: 50px;
          bottom: 0;
          left: 0;
          background: rgba(255, 0, 0, .5);
      }
  `]
})
export class Demo {
  dropOverActive: boolean = false;

  droppedData: string = '';

  onDrop({dropData}: { dropData: any }): void {
    this.dropOverActive = false;
    this.droppedData = dropData;
    setTimeout(() => {
      this.droppedData = '';
    }, 2000);
  }

}
