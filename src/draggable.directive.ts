import {Directive, HostListener, OnInit, ElementRef, Renderer, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeLast';

type Coordinates = {x: number, y: number};

@Directive({
  selector: '[mwlDraggable]'
})
export class Draggable implements OnInit {

  public mouseDown: Subject<any> = new Subject();

  public mouseMove: Subject<any> = new Subject();

  public mouseUp: Subject<any> = new Subject();

  @Output() dragStart: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output() dragging: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output() dragEnd: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  constructor(public element: ElementRef, private renderer: Renderer) {}

  ngOnInit(): void {

    const mouseDrag: Observable<Coordinates> = this.mouseDown.flatMap((mouseDownEvent: MouseEvent) => {

      this.dragStart.next({x: 0, y: 0});

      const mouseMove: Observable<Coordinates> = this.mouseMove
        .map((mouseMoveEvent: MouseEvent) => {
          return {
            x: mouseMoveEvent.clientX - mouseDownEvent.clientX,
            y: mouseMoveEvent.clientY - mouseDownEvent.clientY
          };
        })
        .takeUntil(Observable.merge(this.mouseUp, this.mouseDown));

      mouseMove.takeLast(1).subscribe((finalCoords: Coordinates) => {
        this.dragEnd.next(finalCoords);
        this.renderer.setElementStyle(this.element.nativeElement, 'transform', '');
      });

      return mouseMove;

    });

    mouseDrag.subscribe(({x, y}: Coordinates) => {
      this.dragging.next({x, y});
      this.renderer.setElementStyle(this.element.nativeElement, 'transform', `translate(${x}px, ${y}px)`);
    });

  }

  /**
   * @private
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.mouseDown.next(event);
  }

  /**
   * @private
   */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseMove.next(event);
  }

  /**
   * @private
   */
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.mouseUp.next(event);
  }

}