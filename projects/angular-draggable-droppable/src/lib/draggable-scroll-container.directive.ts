import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  Renderer2
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
  selector: '[mwlDraggableScrollContainer]'
})
export class DraggableScrollContainerDirective implements OnInit {
  /**
   * Trigger the DragStart after a long touch in scrollable container when true
   */
  @Input()
  activeLongPressDrag: boolean = false;

  /**
   * Configuration of a long touch
   * Duration in ms of a long touch before activating DragStart
   * Delta of the
   */
  @Input()
  longPressConfig = { duration: 300, delta: 30 };

  private cancelledScroll = false;

  /**
   * @hidden
   */
  constructor(
    public elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.renderer.listen(
        this.elementRef.nativeElement,
        'touchmove',
        (event: TouchEvent) => {
          if (this.cancelledScroll && event.cancelable) {
            event.preventDefault();
          }
        }
      );
    });
  }

  /**
   * @hidden
   */
  disableScroll(): void {
    this.cancelledScroll = true;
    this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'hidden');
  }

  /**
   * @hidden
   */
  enableScroll(): void {
    this.cancelledScroll = false;
    this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'auto');
  }

  /**
   * @hidden
   */
  hasScrollbar(): boolean {
    const containerHasHorizontalScroll =
      this.elementRef.nativeElement.scrollWidth -
        this.elementRef.nativeElement.clientWidth >
      0;
    const containerHasVerticalScroll =
      this.elementRef.nativeElement.scrollHeight -
        this.elementRef.nativeElement.clientHeight >
      0;
    return containerHasHorizontalScroll || containerHasVerticalScroll;
  }
}
