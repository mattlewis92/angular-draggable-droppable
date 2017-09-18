import { Subject } from 'rxjs/Subject';

export class DraggableHelper {
  currentDrag: Subject<any> = new Subject();
}
