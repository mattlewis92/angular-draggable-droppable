import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  Renderer2
} from '@angular/core';

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

  disableScroll(): void {
    this.cancelledScroll = true;
    this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'hidden');
  }

  enableScroll(): void {
    this.cancelledScroll = false;
    this.renderer.setStyle(this.elementRef.nativeElement, 'overflow', 'auto');
  }

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
