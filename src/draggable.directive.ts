import {Directive, HostListener, OnInit, ElementRef, Renderer, Output, EventEmitter, Input} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeLast';
import {DraggableHelper} from './draggableHelper.provider';

type Coordinates = {x: number, y: number};

@Directive({
  selector: '[mwlDraggable]'
})
export class Draggable implements OnInit {

  @Input() dropData: any;

  @Output() dragStart: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output() dragging: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  @Output() dragEnd: EventEmitter<Coordinates> = new EventEmitter<Coordinates>();

  public mouseDown: Subject<any> = new Subject();

  public mouseMove: Subject<any> = new Subject();

  public mouseUp: Subject<any> = new Subject();

  constructor(public element: ElementRef, private renderer: Renderer, private draggableHelper: DraggableHelper) {}

  ngOnInit(): void {

    const mouseDrag: Observable<any> = this.mouseDown.flatMap((mouseDownEvent: MouseEvent) => {

      this.dragStart.next({x: 0, y: 0});

      const currentDrag: Subject<any> = new Subject();

      this.draggableHelper.currentDrag.next(currentDrag);

      const mouseMove: Observable<Coordinates> = this.mouseMove
        .map((mouseMoveEvent: MouseEvent) => {
          return {
            currentDrag,
            x: mouseMoveEvent.clientX - mouseDownEvent.clientX,
            y: mouseMoveEvent.clientY - mouseDownEvent.clientY
          };
        })
        .takeUntil(Observable.merge(this.mouseUp, this.mouseDown));

      mouseMove.takeLast(1).subscribe(({x, y}) => {
        this.dragEnd.next({x, y});
        currentDrag.complete();
        this.setCssTransform('');
      });

      return mouseMove;

    });

    // TODO - unsubscribe from this on destroy
    mouseDrag.subscribe(({x, y, currentDrag}) => {
      this.dragging.next({x, y});
      this.setCssTransform(`translate(${x}px, ${y}px)`);
      currentDrag.next({rectangle: this.element.nativeElement.getBoundingClientRect(), dropData: this.dropData});
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

  private setCssTransform(value: string): void {
    this.renderer.setElementStyle(this.element.nativeElement, 'transform', value);
    this.renderer.setElementStyle(this.element.nativeElement, '-webkit-transform', value);
    this.renderer.setElementStyle(this.element.nativeElement, '-ms-transform', value);
    this.renderer.setElementStyle(this.element.nativeElement, '-moz-transform', value);
    this.renderer.setElementStyle(this.element.nativeElement, '-o-transform', value);
  }

}