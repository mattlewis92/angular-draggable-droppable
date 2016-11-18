import {Component} from '@angular/core';

@Component({
  selector: 'demo-app',
  template: '<div mwlDraggable>Drag me!</div>',
  styles: [`
    [mwlDraggable] {
      background-color: red;
      width: 200px;
      color: white;
      height: 200px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: move;
    }
  `]
})
export class Demo {}
