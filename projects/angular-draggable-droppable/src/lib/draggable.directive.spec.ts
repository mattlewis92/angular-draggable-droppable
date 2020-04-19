import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { triggerDomEvent } from '../test-utils';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DraggableDirective, ValidateDrag } from './draggable.directive';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
import { By } from '@angular/platform-browser';

describe('draggable directive', () => {
  @Component({
    template: `
      <div
        mwlDraggable
        #draggableElement
        [dragAxis]="dragAxis"
        [dragSnapGrid]="dragSnapGrid"
        [ghostDragEnabled]="ghostDragEnabled"
        [showOriginalElementWhileDragging]="showOriginalElementWhileDragging"
        [validateDrag]="validateDrag"
        [dragCursor]="dragCursor"
        [dragActiveClass]="dragActiveClass"
        [ghostElementAppendTo]="ghostElementAppendTo"
        [ghostElementTemplate]="ghostElementTemplate"
        (dragPointerDown)="dragPointerDown($event)"
        (dragStart)="dragStart($event)"
        (ghostElementCreated)="ghostElementCreated($event)"
        (dragging)="dragging($event)"
        (dragEnd)="dragEnd($event)"
      >
        Drag me!
      </div>
      <ng-template #ghostElementTemplateRef>
        <span>{{ 1 + 1 }} test</span>
      </ng-template>
    `
  })
  class TestComponent {
    @ViewChild(DraggableDirective)
    draggable: DraggableDirective;
    @ViewChild('draggableElement')
    draggableElement: ElementRef<HTMLDivElement>;
    @ViewChild('ghostElementTemplateRef')
    ghostElementTemplateRef: TemplateRef<any>;
    dragPointerDown = sinon.spy();
    dragStart = sinon.spy();
    ghostElementCreated = sinon.spy();
    dragging = sinon.spy();
    dragEnd = sinon.spy();
    dragAxis: any = { x: true, y: true };
    dragSnapGrid: any = {};
    ghostDragEnabled: boolean = true;
    showOriginalElementWhileDragging: boolean = false;
    validateDrag: ValidateDrag;
    dragCursor = 'move';
    dragActiveClass: string;
    ghostElementAppendTo: HTMLElement;
    ghostElementTemplate: TemplateRef<any>;
  }

  @Component({
    // tslint:disable-line max-classes-per-file
    template: `
      <div mwlDraggableScrollContainer>
        <div
          #draggableElement
          mwlDraggable
          [dragAxis]="{ x: true, y: true }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
          (dragPointerDown)="dragPointerDown($event)"
          (dragStart)="dragStart($event)"
          (ghostElementCreated)="ghostElementCreated($event)"
          (dragging)="dragging($event)"
          (dragEnd)="dragEnd($event)"
        >
          Drag me!
        </div>
      </div>
    `,
    styles: [
      `
        [mwlDraggableScrollContainer] {
          height: 25px;
          overflow: scroll;
          position: fixed;
          top: 0;
          left: 0;
        }
        [mwlDraggable] {
          position: relative;
          width: 50px;
          height: 50px;
          z-index: 1;
        }
      `
    ]
  })
  class ScrollTestComponent extends TestComponent {
    @ViewChild(DraggableScrollContainerDirective)
    scrollContainer: DraggableScrollContainerDirective;
  }

  @Component({
    // tslint:disable-line max-classes-per-file
    template: `
      <div
        mwlDraggable
        [dragAxis]="{ x: true, y: true }"
        (dragPointerDown)="outerDrag($event)"
        (dragStart)="outerDrag($event)"
        (ghostElementCreated)="outerDrag($event)"
        (dragging)="outerDrag($event)"
        (dragEnd)="outerDrag($event)"
      >
        <button
          #draggableElement
          mwlDraggable
          [dragAxis]="{ x: true, y: true }"
          (dragPointerDown)="dragPointerDown($event)"
          (dragStart)="dragStart($event)"
          (ghostElementCreated)="ghostElementCreated($event)"
          (dragging)="dragging($event)"
          (dragEnd)="dragEnd($event)"
        >
          Drag me as well
        </button>
      </div>
    `,
    styles: [
      `
        div[mwlDraggable] {
          position: relative;
          width: 50px;
          height: 50px;
          z-index: 1;
        }
      `
    ]
  })
  class InnerDragTestComponent extends TestComponent {
    outerDrag = sinon.spy();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DragAndDropModule],
      declarations: [TestComponent, ScrollTestComponent, InnerDragTestComponent]
    });
  });

  let fixture: ComponentFixture<TestComponent>;
  beforeEach(() => {
    document.body.style.margin = '0px';
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement.children[0]);
  });

  afterEach(() => {
    fixture.destroy();
    document.body.innerHTML = '';
    Array.from(document.head.getElementsByTagName('style')).forEach(style => {
      document.head.removeChild(style);
    });
  });

  it('should make the element draggable', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    expect(fixture.componentInstance.dragPointerDown).to.have.been.calledWith({
      x: 0,
      y: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    expect(fixture.componentInstance.dragStart).to.have.been.calledOnce;
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: 0
    });
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(ghostElement.style.transform).to.equal('translate3d(2px, 0px, 0px)');
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 8 });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: -2
    });
    expect(ghostElement.style.transform).to.equal(
      'translate3d(2px, -2px, 0px)'
    );
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 2,
      y: -2,
      dragCancelled: false
    });
  });

  it('should end the pointerUp$ observable when the component is destroyed', () => {
    const complete = sinon.spy();
    fixture.componentInstance.draggable.pointerUp$.subscribe({ complete });
    fixture.destroy();
    expect(complete).to.have.been.calledOnce;
  });

  it('should end the pointerDown$ observable when the component is destroyed', () => {
    const complete = sinon.spy();
    fixture.componentInstance.draggable.pointerDown$.subscribe({ complete });
    fixture.destroy();
    expect(complete).to.have.been.calledOnce;
  });

  it('should end the pointerMove$ observable when the component is destroyed', () => {
    const complete = sinon.spy();
    fixture.componentInstance.draggable.pointerMove$.subscribe({ complete });
    fixture.destroy();
    expect(complete).to.have.been.calledOnce;
  });

  it('should disable dragging along the x axis', () => {
    fixture.componentInstance.dragAxis = { x: false, y: true };
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 12 });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 0,
      y: 2
    });
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(ghostElement.style.transform).to.equal('translate3d(0px, 2px, 0px)');
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 12,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 0,
      y: 2,
      dragCancelled: false
    });
  });

  it('should disable dragging along the y axis', () => {
    fixture.componentInstance.dragAxis = { x: true, y: false };
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 12 });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: 0
    });
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(ghostElement.style.transform).to.equal('translate3d(2px, 0px, 0px)');
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 12,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 2,
      y: 0,
      dragCancelled: false
    });
  });

  it('should disable dragging', () => {
    expect(
      Object.keys(
        fixture.componentInstance.draggable['eventListenerSubscriptions']
      ).length
    ).to.equal(7);
    fixture.componentInstance.dragAxis = { x: false, y: false };
    fixture.detectChanges();
    expect(
      Object.keys(
        fixture.componentInstance.draggable['eventListenerSubscriptions']
      ).length
    ).to.equal(0);
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 12 });
    expect(fixture.componentInstance.dragStart).not.to.have.been.called;
    expect(fixture.componentInstance.dragging).not.to.have.been.called;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 12,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).not.to.have.been.called;
  });

  it('should snap all horizontal drags to a grid', () => {
    fixture.componentInstance.dragSnapGrid = { x: 10 };
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 12 });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 0,
      y: 2
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 14,
      clientY: 18
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 10,
      y: 8
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 15,
      clientY: 20
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 10,
      y: 10
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 16,
      clientY: 22
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 10,
      y: 12
    });
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 16,
      clientY: 22,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 10,
      y: 12,
      dragCancelled: false
    });
  });

  it('should snap all vertical drags to a grid', () => {
    fixture.componentInstance.dragSnapGrid = { y: 10 };
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 10,
      clientY: 5,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 12, clientY: 7 });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: 0
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 18,
      clientY: 14
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 8,
      y: 10
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 20,
      clientY: 15
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 10,
      y: 10
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 22,
      clientY: 16
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 12,
      y: 10
    });
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 22,
      clientY: 16,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 12,
      y: 10,
      dragCancelled: false
    });
  });

  it('should snap all vertical and horizontal drags to a grid', () => {
    fixture.componentInstance.dragSnapGrid = { y: 10, x: 10 };
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 10,
      clientY: 5,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 20,
      clientY: 15
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 10,
      y: 10
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 22,
      clientY: 16
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 10,
      y: 10
    });
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 22,
      clientY: 16,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 10,
      y: 10,
      dragCancelled: false
    });
  });

  it('should disable the ghost dragging effect', () => {
    fixture.componentInstance.ghostDragEnabled = false;
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    expect(fixture.componentInstance.dragStart).to.have.been.calledOnce;
    expect(fixture.componentInstance.ghostElementCreated).not.to.have.been
      .called;
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: 0
    });
    expect(draggableElement.nextSibling).not.to.ok;
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 8 });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: -2
    });
    expect(draggableElement.nextSibling).not.to.ok;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 2,
      y: -2,
      dragCancelled: false
    });
    expect(draggableElement.nextSibling).not.to.ok;
  });

  it('should auto set the mouse cursor to the move icon on hover', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mouseenter', draggableElement);
    expect(draggableElement.style.cursor).to.equal('move');
    triggerDomEvent('mouseleave', draggableElement);
    expect(draggableElement.style.cursor).not.to.be.ok;
  });

  it('should not set the mouse cursor when the element cant be dragged', () => {
    fixture.componentInstance.dragAxis = { x: false, y: false };
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mouseenter', draggableElement);
    expect(draggableElement.style.cursor).not.to.be.ok;
  });

  it('should not set the mouse cursor when the element is being dragged', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 10,
      clientY: 5,
      button: 0
    });
    triggerDomEvent('mouseenter', draggableElement);
    expect(draggableElement.style.cursor).not.to.be.ok;
  });

  it('should not call the dragging event multiple times with the same values', () => {
    fixture.componentInstance.dragSnapGrid = { y: 10, x: 10 };
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 10,
      clientY: 5,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 12,
      clientY: 15
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledOnce;
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 0,
      y: 10
    });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 14,
      clientY: 18
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledOnce;
  });

  it('should allow drags to be validated', () => {
    fixture.componentInstance.validateDrag = ({ x, y }) => x > 0 && y > 0;
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 3, clientY: 10 });
    expect(fixture.componentInstance.dragStart).not.to.have.been.called;
    expect(fixture.componentInstance.dragging).not.to.have.been.calledWith({
      x: -2,
      y: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 8 });
    expect(fixture.componentInstance.dragStart).not.to.have.been.called;
    expect(fixture.componentInstance.dragging).not.to.have.been.calledWith({
      x: 2,
      y: -2
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 12 });
    expect(fixture.componentInstance.dragStart).to.have.been.calledOnce;
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: 2
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 3, clientY: 10 });
    expect(fixture.componentInstance.dragging).not.to.have.been.calledWith({
      x: -2,
      y: 0
    });
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 3,
      clientY: 10,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 2,
      y: 2,
      dragCancelled: false
    });
  });

  it('should only call the dragEnd event once', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 8 });
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledOnce;
  });

  it('should only unregister the mouse move listener if it exists', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    expect(
      fixture.componentInstance.draggable['eventListenerSubscriptions']
        .mousemove
    ).not.to.be.ok;
  });

  it('should not register multiple mouse move listeners', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    const mouseMoveUnsubscribe =
      fixture.componentInstance.draggable['eventListenerSubscriptions']
        .mousemove;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    expect(
      fixture.componentInstance.draggable['eventListenerSubscriptions']
        .mousemove
    ).to.equal(mouseMoveUnsubscribe);
  });

  it('should work with touch events', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    fixture.debugElement
      .query(By.directive(DraggableDirective))
      .triggerEventHandler('touchstart', {
        touches: [{ clientX: 5, clientY: 10 }]
      });
    triggerDomEvent('touchmove', draggableElement, {
      targetTouches: [{ clientX: 7, clientY: 10 }]
    });
    expect(fixture.componentInstance.dragStart).to.have.been.calledOnce;
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: 0
    });
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(ghostElement.style.transform).to.equal('translate3d(2px, 0px, 0px)');
    triggerDomEvent('touchmove', draggableElement, {
      targetTouches: [{ clientX: 7, clientY: 8 }]
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: -2
    });
    expect(ghostElement.style.transform).to.equal(
      'translate3d(2px, -2px, 0px)'
    );
    triggerDomEvent('touchend', draggableElement, {
      changedTouches: [{ clientX: 7, clientY: 8 }]
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 2,
      y: -2,
      dragCancelled: false
    });
  });

  it('should work use the touch cancel event to end the drag', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('touchstart', draggableElement, {
      touches: [{ clientX: 5, clientY: 10 }]
    });
    triggerDomEvent('touchmove', draggableElement, {
      targetTouches: [{ clientX: 7, clientY: 10 }]
    });
    expect(fixture.componentInstance.dragStart).to.have.been.calledOnce;
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: 0
    });
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(ghostElement.style.transform).to.equal('translate3d(2px, 0px, 0px)');
    triggerDomEvent('touchmove', draggableElement, {
      targetTouches: [{ clientX: 7, clientY: 8 }]
    });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: -2
    });
    expect(ghostElement.style.transform).to.equal(
      'translate3d(2px, -2px, 0px)'
    );
    triggerDomEvent('touchcancel', draggableElement, {
      changedTouches: [{ clientX: 7, clientY: 8 }]
    });
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 2,
      y: -2,
      dragCancelled: false
    });
  });

  it('should only unregister the touch move listener if it exists', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('touchend', draggableElement, {
      changedTouches: [{ clientX: 7, clientY: 8 }]
    });
    expect(
      fixture.componentInstance.draggable['eventListenerSubscriptions']
        .touchmove
    ).not.to.be.ok;
  });

  it('should not register multiple touch move listeners', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('touchstart', draggableElement, {
      touches: [{ clientX: 7, clientY: 8 }]
    });
    const touchMoveUnsubscribe =
      fixture.componentInstance.draggable['eventListenerSubscriptions']
        .touchmove;
    triggerDomEvent('touchstart', draggableElement, {
      touches: [{ clientX: 7, clientY: 8 }]
    });
    expect(
      fixture.componentInstance.draggable['eventListenerSubscriptions']
        .touchmove
    ).to.equal(touchMoveUnsubscribe);
  });

  it('should disable the mouse move cursor', () => {
    fixture.componentInstance.dragCursor = '';
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mouseenter', draggableElement);
    expect(draggableElement.style.cursor).not.to.be.ok;
    triggerDomEvent('mouseleave', draggableElement);
    expect(draggableElement.style.cursor).not.to.be.ok;
  });

  it('should not call dragStart and dragEnd events when clicking on the draggable', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    expect(fixture.componentInstance.dragPointerDown).to.have.been.calledOnce;
    expect(fixture.componentInstance.dragStart).not.to.have.been.called;
    expect(fixture.componentInstance.dragging).not.to.have.been.called;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    expect(fixture.componentInstance.dragEnd).not.to.have.been.called;
  });

  it('should call the drag lifecycle events in order', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    sinon.assert.callOrder(
      fixture.componentInstance.dragPointerDown,
      fixture.componentInstance.dragStart,
      fixture.componentInstance.ghostElementCreated,
      fixture.componentInstance.dragging,
      fixture.componentInstance.dragEnd
    );
  });

  it('should create a clone of the element', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(ghostElement.style.position).to.equal('fixed');
    expect(ghostElement.style.top).to.be.ok;
    expect(ghostElement.style.left).to.be.ok;
    expect(ghostElement.style.width).to.be.ok;
    expect(ghostElement.style.height).to.be.ok;
    expect(draggableElement.style.visibility).to.equal('hidden');
    expect((ghostElement as HTMLElement).hasAttribute('mwldraggable')).to.be
      .true;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    expect(draggableElement.style.visibility).not.to.be.ok;
  });

  it('should expose the mouse coordinates and ghost element', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 6, clientY: 10 });
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(
      fixture.componentInstance.ghostElementCreated
    ).to.have.been.calledWith({
      element: ghostElement,
      clientX: 5,
      clientY: 10
    });
  });

  it('should create a clone of the element and leave old element visible', () => {
    fixture.componentInstance.showOriginalElementWhileDragging = true;
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    expect(draggableElement.style.visibility).not.to.be.ok;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
  });

  it('should add and remove the drag active class', () => {
    fixture.componentInstance.dragActiveClass = 'drag-active';
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    expect(draggableElement.classList.contains('drag-active')).to.be.true;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    expect(draggableElement.classList.contains('drag-active')).to.be.false;
  });

  it('should add and remove multiple drag active class', () => {
    fixture.componentInstance.dragActiveClass =
      'drag-active drag-active-secondary';
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    expect(draggableElement.classList.contains('drag-active')).to.be.true;
    expect(draggableElement.classList.contains('drag-active-secondary')).to.be
      .true;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    expect(draggableElement.classList.contains('drag-active')).to.be.false;
    expect(draggableElement.classList.contains('drag-active-secondary')).to.be
      .false;
  });

  it('should append the ghost element to the given element', () => {
    fixture.componentInstance.ghostElementAppendTo = document.createElement(
      'div'
    );
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    const ghostElement = fixture.componentInstance.ghostElementAppendTo
      .children[0] as HTMLElement;
    expect(ghostElement.style.position).to.equal('fixed');
    expect(ghostElement.style.top).to.be.ok;
    expect(ghostElement.style.left).to.be.ok;
    expect(ghostElement.style.width).to.be.ok;
    expect(ghostElement.style.height).to.be.ok;
    expect((ghostElement as HTMLElement).hasAttribute('mwldraggable')).to.be
      .true;
  });

  it('should make all elements on the page unable to select text while dragging', () => {
    const tmp = document.createElement('div');
    tmp.innerHTML = 'foo';
    document.body.appendChild(tmp);
    expect(getComputedStyle(tmp).userSelect).to.equal('auto');
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    expect(getComputedStyle(tmp).userSelect).to.equal('none');
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 7,
      clientY: 10,
      button: 0
    });
    expect(getComputedStyle(tmp).userSelect).to.equal('none');
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 8,
      button: 0
    });
    expect(getComputedStyle(tmp).userSelect).to.equal('auto');
  });

  it('should cancel the drag', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    expect(fixture.componentInstance.dragPointerDown).to.have.been.calledWith({
      x: 0,
      y: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    expect(fixture.componentInstance.dragStart).to.have.been.calledOnce;
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: 0
    });
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(ghostElement.style.transform).to.equal('translate3d(2px, 0px, 0px)');
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 8 });
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: -2
    });
    expect(ghostElement.style.transform).to.equal(
      'translate3d(2px, -2px, 0px)'
    );
    fixture.componentInstance.dragStart.getCall(0).args[0].cancelDrag$.next();
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 2,
      y: -2,
      dragCancelled: true
    });
    expect(draggableElement.nextSibling).to.not.equal(ghostElement);
  });

  it('should trigger the drag end event when the component is destroyed', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    expect(getComputedStyle(document.body.children[0]).userSelect).to.equal(
      'none'
    );
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 8 });
    fixture.destroy();
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 2,
      y: -2,
      dragCancelled: false
    });
    expect(getComputedStyle(document.body.children[0]).userSelect).to.equal(
      'auto'
    );
  });

  it('should use the contents of the ghost element template as the inner html of the ghost element', () => {
    fixture.componentInstance.ghostElementTemplate =
      fixture.componentInstance.ghostElementTemplateRef;
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 10 });
    fixture.detectChanges();
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(ghostElement.innerHTML).to.equal('<span>2 test</span>');
  });

  it('should handle the parent element being scrolled while dragging', () => {
    const scrollFixture = TestBed.createComponent(ScrollTestComponent);
    scrollFixture.detectChanges();
    document.body.appendChild(scrollFixture.nativeElement);
    const draggableElement =
      scrollFixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    expect(
      scrollFixture.componentInstance.dragPointerDown
    ).to.have.been.calledWith({
      x: 0,
      y: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 12 });
    expect(scrollFixture.componentInstance.dragStart).to.have.been.calledOnce;
    expect(scrollFixture.componentInstance.dragging).to.have.been.calledWith({
      x: 0,
      y: 2
    });
    const ghostElement = draggableElement.nextSibling as HTMLElement;
    expect(ghostElement.style.transform).to.equal('translate3d(0px, 2px, 0px)');
    scrollFixture.componentInstance.scrollContainer.elementRef.nativeElement.scrollTop = 5;
    scrollFixture.debugElement
      .query(By.directive(DraggableScrollContainerDirective))
      .triggerEventHandler('scroll', {});
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 14 });
    expect(scrollFixture.componentInstance.dragging).to.have.been.calledWith({
      x: 0,
      y: 9
    });
    expect(ghostElement.style.transform).to.equal('translate3d(0px, 4px, 0px)');
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 5,
      clientY: 14,
      button: 0
    });
    expect(scrollFixture.componentInstance.dragEnd).to.have.been.calledWith({
      x: 0,
      y: 9,
      dragCancelled: false
    });
  });

  it('should allow elements to be selected if clicking but not dragging the element', () => {
    const tmp = document.createElement('div');
    tmp.innerHTML = 'foo';
    document.body.appendChild(tmp);
    expect(getComputedStyle(tmp).userSelect).to.equal('auto');
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    expect(getComputedStyle(tmp).userSelect).to.equal('none');
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    expect(getComputedStyle(tmp).userSelect).to.equal('auto');
  });

  it('should allow for draggable elements to be inside other draggable elements', () => {
    const innerDragFixture = TestBed.createComponent(InnerDragTestComponent);
    innerDragFixture.detectChanges();
    document.body.appendChild(innerDragFixture.nativeElement);
    const draggableElement =
      innerDragFixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    expect(innerDragFixture.componentInstance.dragPointerDown).to.have.been
      .calledOnce;
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 12 });
    expect(innerDragFixture.componentInstance.dragStart).to.have.been
      .calledOnce;
    expect(innerDragFixture.componentInstance.dragging).to.have.been.calledOnce;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 5,
      clientY: 14,
      button: 0
    });
    expect(innerDragFixture.componentInstance.dragEnd).to.have.been.calledOnce;
    expect(innerDragFixture.componentInstance.outerDrag).not.to.have.been
      .called;
  });

  const clock = sinon.useFakeTimers();

  it('should not start dragging with long touch', () => {
    const scrollFixture = TestBed.createComponent(ScrollTestComponent);
    scrollFixture.detectChanges();
    document.body.appendChild(scrollFixture.nativeElement);
    const draggableElement =
      scrollFixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('touchstart', draggableElement, {
      touches: [{ clientX: 5, clientY: 10 }]
    });
    clock.tick(200);

    // Touch is too short
    triggerDomEvent('touchmove', draggableElement, {
      targetTouches: [{ clientX: 5, clientY: 10 }]
    });
    expect(scrollFixture.componentInstance.dragStart).not.to.have.been.called;

    // Touch is too far from touchstart position
    clock.tick(200);
    triggerDomEvent('touchmove', draggableElement, {
      targetTouches: [{ clientX: 30, clientY: 20 }]
    });
    expect(scrollFixture.componentInstance.dragStart).not.to.have.been.called;

    // Scroll begin so drag can't start
    clock.tick(400);
    scrollFixture.componentInstance.scrollContainer.elementRef.nativeElement.scrollTop = 5;
    triggerDomEvent('touchmove', draggableElement, {
      targetTouches: [{ clientX: 5, clientY: 5 }]
    });
    expect(scrollFixture.componentInstance.dragStart).not.to.have.been.called;
    triggerDomEvent('touchend', draggableElement, {
      changedTouches: [{ clientX: 10, clientY: 18 }]
    });
  });

  it('should start dragging with long touch', () => {
    const scrollFixture = TestBed.createComponent(ScrollTestComponent);
    scrollFixture.detectChanges();
    document.body.appendChild(scrollFixture.nativeElement);
    const draggableElement =
      scrollFixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('touchstart', draggableElement, {
      touches: [{ clientX: 5, clientY: 10 }]
    });
    clock.tick(400);
    triggerDomEvent('touchmove', draggableElement, {
      targetTouches: [{ clientX: 5, clientY: 10 }]
    });
    expect(scrollFixture.componentInstance.dragStart).to.have.been.calledOnce;

    triggerDomEvent('touchmove', draggableElement, {
      targetTouches: [{ clientX: 7, clientY: 12 }]
    });
    expect(scrollFixture.componentInstance.dragging).to.have.been.calledWith({
      x: 2,
      y: 2
    });
    triggerDomEvent('touchend', draggableElement, {
      changedTouches: [{ clientX: 10, clientY: 18 }]
    });
  });

  it('should expose the css transform on the validate drag function', () => {
    const scrollFixture = TestBed.createComponent(ScrollTestComponent);
    scrollFixture.componentInstance.validateDrag = sinon.stub().returns(true);
    scrollFixture.detectChanges();
    document.body.appendChild(scrollFixture.nativeElement);
    const draggableElement =
      scrollFixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 0
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 12 });
    scrollFixture.componentInstance.scrollContainer.elementRef.nativeElement.scrollTop = 5;
    scrollFixture.debugElement
      .query(By.directive(DraggableScrollContainerDirective))
      .triggerEventHandler('scroll', {});
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 14 });
    expect(
      scrollFixture.componentInstance.validateDrag
    ).to.have.been.calledWith({
      x: 0,
      y: 9,
      transform: {
        x: 0,
        y: 4
      }
    });
  });

  it('should not drag when right clicking', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {
      clientX: 5,
      clientY: 10,
      button: 2
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 7, clientY: 12 });
    expect(fixture.componentInstance.dragStart).not.to.have.been.called;
    expect(fixture.componentInstance.dragging).not.to.have.been.called;
    triggerDomEvent('mouseup', draggableElement, {
      clientX: 7,
      clientY: 12,
      button: 2
    });
    expect(fixture.componentInstance.dragEnd).not.to.have.been.called;
  });

  it('should disable right click events on touch events', () => {
    const scrollFixture = TestBed.createComponent(ScrollTestComponent);
    scrollFixture.detectChanges();
    document.body.appendChild(scrollFixture.nativeElement);
    const draggableElement =
      scrollFixture.componentInstance.draggableElement.nativeElement;

    const preventDefault = sinon.spy();

    triggerDomEvent('contextmenu', document.body, {
      preventDefault
    });

    expect(preventDefault).not.to.have.been.called;

    triggerDomEvent('touchstart', draggableElement, {
      touches: [{ clientX: 5, clientY: 10 }]
    });

    triggerDomEvent('contextmenu', document.body, {
      preventDefault
    });

    expect(preventDefault).to.have.been.calledOnce;
  });
});
