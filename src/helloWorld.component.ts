import {
  Component
} from '@angular/core';

@Component({
  selector: 'hello-world',
  template: 'Hello world from the {{ projectTitle }} module!'
})
export class HelloWorld {
  projectTitle: string = 'angular 2.0+ drag and drop';
}
