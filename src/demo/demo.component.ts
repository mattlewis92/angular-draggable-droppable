import { Component, ElementRef, ViewChild } from '@angular/core';
import { DropEvent } from 'angular-draggable-droppable';
import {
  DroppableDirective,
  ValidateDrop,
} from 'projects/angular-draggable-droppable/src/lib/droppable.directive';

@Component({
  selector: 'mwl-demo-app',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent {
  droppedData: string = '';
  droppedData2: string = '';

  @ViewChild(DroppableDirective, { read: ElementRef })
  droppableElement: ElementRef;

  onDrop({ dropData }: DropEvent<string>): void {
    this.droppedData = dropData;
    setTimeout(() => {
      this.droppedData = '';
    }, 2000);
  }

  onDrop2({ dropData }: DropEvent<string>): void {
    this.droppedData2 = dropData;
    setTimeout(() => {
      this.droppedData2 = '';
    }, 2000);
  }

  validateDrop: ValidateDrop = ({ target }) =>
    this.droppableElement.nativeElement.contains(target as Node);
}
