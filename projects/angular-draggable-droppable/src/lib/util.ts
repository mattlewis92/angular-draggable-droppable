import { ElementRef, Renderer2 } from '@angular/core';

export function addClass(
  renderer: Renderer2,
  element: ElementRef<HTMLElement>,
  classToAdd: string
) {
  if (classToAdd) {
    classToAdd
      .split(' ')
      .forEach((className) =>
        renderer.addClass(element.nativeElement, className)
      );
  }
}

export function removeClass(
  renderer: Renderer2,
  element: ElementRef<HTMLElement>,
  classToRemove: string
) {
  if (classToRemove) {
    classToRemove
      .split(' ')
      .forEach((className) =>
        renderer.removeClass(element.nativeElement, className)
      );
  }
}
