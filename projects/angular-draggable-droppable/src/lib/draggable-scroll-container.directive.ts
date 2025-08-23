import { Directive, ElementRef } from '@angular/core';

/**
 * If the window isn't scrollable, then place this on the scrollable container that draggable elements are inside. e.g.
 * ```html
  <div style="overflow: scroll" mwlDraggableScrollContainer>
    <div mwlDraggable>Drag me!</div>
  </div>
  ```
 */
@Directive({
  selector: '[mwlDraggableScrollContainer]',
})
export class DraggableScrollContainerDirective {
  /**
   * @hidden
   */
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
