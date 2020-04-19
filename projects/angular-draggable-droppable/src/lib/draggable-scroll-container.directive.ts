import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  Renderer2,
} from '@angular/core';

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
   * Trigger the DragStart after a long touch in scrollable container when true
   * @deprecated will be removed in v5 (use [touchStartLongPress]="{delay: 300, delta: 30}" on the mwlDraggable element instead)
   */
  @Input() activeLongPressDrag: boolean = false;

  /**
   * Configuration of a long touch
   * Duration in ms of a long touch before activating DragStart
   * Delta of the
   * @deprecated will be removed in v5 (use [touchStartLongPress]="{delay: 300, delta: 30}" on the mwlDraggable element instead)
   */
  @Input() longPressConfig = { duration: 300, delta: 30 };

  /**
   * @hidden
   */
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
