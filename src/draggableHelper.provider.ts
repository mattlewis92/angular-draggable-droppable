import {Subject} from 'rxjs/Subject';

export class DraggableHelper {
  currentDrag: Subject<any> = new Subject();

  getScrollParent(element: Element): Element {
    if (element == null) {
      return document.scrollingElement;
    }

    let overflowY: string = window.getComputedStyle(element).overflowY;
    let isScrollable: boolean = overflowY !== 'visible' && overflowY !== 'hidden';

    if (isScrollable && element.scrollHeight > element.clientHeight) {
      return element;
    } else {
      return this.getScrollParent(element.parentElement);
    }
  }
}