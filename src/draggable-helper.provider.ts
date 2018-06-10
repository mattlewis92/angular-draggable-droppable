import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DraggableHelper {
  currentDrag: Subject<any> = new Subject();
}
