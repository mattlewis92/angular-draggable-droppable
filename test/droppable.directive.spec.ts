import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { triggerDomEvent } from './util';
import { DragAndDropModule } from '../src/index';
import { DraggableDirective } from '../src/draggable.directive';
import { DroppableDirective } from '../src/droppable.directive';

describe('droppable directive', () => {
  @Component({
    template: `
      <div mwlDraggable [dropData]="dropData" (dragEnd)="dragEnd()">Drag me!</div>
      <div
        #droppableElement
        mwlDroppable
        (dragEnter)="dragEvent('enter', $event)"
        (dragOver)="dragEvent('over', $event)"
        (dragLeave)="dragEvent('leave', $event)"
        (drop)="drop($event)"
        [dragOverClass]="dragOverClass">
        Drop here
      </div>
    `,
    styles: [
      `
        [mwlDraggable] {
          position: relative;
          width: 50px;
          height: 50px;
          z-index: 1;
          margin-top: -200px;
        }
        [mwlDroppable] {
          position: relative;
          top: 100px;
          left: 0;
          width: 200px;
          height: 200px;
        }
      `
    ]
  })
  class TestComponent {
    @ViewChild(DraggableDirective) draggable: DraggableDirective;
    @ViewChild('droppableElement') droppableElement: ElementRef;
    dragEvent = sinon.spy();
    drop = sinon.spy();
    dragEnd = sinon.spy();
    dropData: {
      foo: 'bar';
    };
    dragOverClass: string;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DragAndDropModule.forRoot()],
      declarations: [TestComponent]
    });
  });

  let fixture: ComponentFixture<TestComponent>;
  beforeEach(() => {
    document.body.style.margin = '0px';
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    fixture.componentInstance.draggable.dropData = { foo: 'bar' };
    document.body.appendChild(fixture.nativeElement.children[0]);
  });

  afterEach(() => {
    fixture.destroy();
    document.body.innerHTML = '';
  });

  it('should fire the drag enter, over and leave events', () => {
    const draggableElement: HTMLElement =
      fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    expect(fixture.componentInstance.dragEvent).not.to.have.been.called;
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 50 });
    expect(fixture.componentInstance.dragEvent).not.to.have.been.called;
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 120
    });
    expect(fixture.componentInstance.dragEvent.getCall(0).args).to.deep.equal([
      'enter',
      { dropData: { foo: 'bar' } }
    ]);
    expect(fixture.componentInstance.dragEvent.getCall(1).args).to.deep.equal([
      'over',
      { dropData: { foo: 'bar' } }
    ]);
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 125
    });
    expect(fixture.componentInstance.dragEvent.getCall(2).args).to.deep.equal([
      'over',
      { dropData: { foo: 'bar' } }
    ]);
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 50 });
    expect(fixture.componentInstance.dragEvent.getCall(3).args).to.deep.equal([
      'leave',
      { dropData: { foo: 'bar' } }
    ]);
  });

  it('should not fire the drop event', () => {
    const draggableElement: HTMLElement =
      fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 120
    });
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 50 });
    triggerDomEvent('mouseup', draggableElement, { clientX: 5, clientY: 50 });
    expect(fixture.componentInstance.drop).not.to.have.been.called;
  });

  it('should fire the drop event', () => {
    const draggableElement: HTMLElement =
      fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 120
    });
    triggerDomEvent('mouseup', draggableElement, { clientX: 5, clientY: 120 });
    expect(fixture.componentInstance.drop).to.have.been.calledWith({
      dropData: { foo: 'bar' }
    });
  });

  it('should not fire the drag enter event until the mouse cursor is within the element', () => {
    const draggableElement: HTMLElement =
      fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    expect(fixture.componentInstance.dragEvent).not.to.have.been.called;
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 50 });
    expect(fixture.componentInstance.dragEvent).not.to.have.been.called;
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 99 });
    expect(fixture.componentInstance.dragEvent).not.to.have.been.called;
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 100
    });
    expect(fixture.componentInstance.dragEvent.getCall(0).args).to.deep.equal([
      'enter',
      { dropData: { foo: 'bar' } }
    ]);
    expect(fixture.componentInstance.dragEvent.getCall(1).args).to.deep.equal([
      'over',
      { dropData: { foo: 'bar' } }
    ]);
  });

  it('should add a class to the droppable element when an element is dragged over it', () => {
    fixture.componentInstance.dragOverClass = 'drag-over';
    fixture.detectChanges();
    const draggableElement: HTMLElement =
      fixture.componentInstance.draggable.element.nativeElement;
    const droppableElement: HTMLElement =
      fixture.componentInstance.droppableElement.nativeElement;
    expect(droppableElement.classList.contains('drag-over')).to.be.false;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    expect(droppableElement.classList.contains('drag-over')).to.be.false;
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 100
    });
    expect(droppableElement.classList.contains('drag-over')).to.be.true;
    triggerDomEvent('mouseup', draggableElement, { clientX: 5, clientY: 120 });
    expect(droppableElement.classList.contains('drag-over')).to.be.false;
  });

  it('should fire the drag end event after the drop event', () => {
    const draggableElement: HTMLElement =
      fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 120
    });
    triggerDomEvent('mouseup', draggableElement, { clientX: 5, clientY: 120 });
    sinon.assert.callOrder(
      fixture.componentInstance.drop,
      fixture.componentInstance.dragEnd
    );
  });
});
