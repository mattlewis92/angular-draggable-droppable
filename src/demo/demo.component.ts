import { Component } from '@angular/core';
import { DropEvent } from 'angular-draggable-droppable';

@Component({
  selector: 'mwl-demo-app',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
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
