import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[mwlDraggableScrollContainer]'
})
export class DraggableScrollContainerDirective {
  constructor(public elementRef: ElementRef) {}
}
