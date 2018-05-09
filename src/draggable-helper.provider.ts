import { Subject } from 'rxjs';

export class DraggableHelper {
  currentDrag: Subject<any> = new Subject();
}
