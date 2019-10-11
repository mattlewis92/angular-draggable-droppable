import { Renderer2 } from '@angular/core';

export function addClass(
  renderer: Renderer2,
  element: HTMLElement,
  className: string
) {
  if (className) {
    renderer.addClass(element, className);
  }
}

export function removeClass(
  renderer: Renderer2,
  element: HTMLElement,
  className: string
) {
  if (className) {
    renderer.removeClass(element, className);
  }
}
