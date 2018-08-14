import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { triggerDomEvent } from '../test-utils';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
import { By } from '@angular/platform-browser';

describe('droppable directive', () => {
  @Component({
    template: `
      <div
        #draggableElement
        mwlDraggable
        [dropData]="dropData"
        (dragEnd)="dragEnd()">
        Drag me!
      </div>
      <div
        #droppableElement
        mwlDroppable
        (dragEnter)="dragEvent('enter', $event)"
        (dragOver)="dragEvent('over', $event)"
        (dragLeave)="dragEvent('leave', $event)"
        (drop)="drop($event)"
        [dragOverClass]="dragOverClass"
        [dragActiveClass]="dragActiveClass">
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
    @ViewChild(DraggableDirective)
    draggable: DraggableDirective;
    @ViewChild(DroppableDirective)
    droppable: DroppableDirective;
    @ViewChild('droppableElement')
    droppableElement: ElementRef<HTMLDivElement>;
    @ViewChild('draggableElement')
    draggableElement: ElementRef<HTMLDivElement>;
    dragEvent = sinon.spy();
    drop = sinon.spy();
    dragEnd = sinon.spy();
    dropData = {
      foo: 'bar'
    };
    dragOverClass: string;
    dragActiveClass: string;
  }

  @Component({
    // tslint:disable-line max-classes-per-file
    template: `
      <div mwlDraggableScrollContainer>
        <div
          #draggableElement
          mwlDraggable
          [dropData]="dropData"
          (dragEnd)="dragEnd()">
          Drag me!
        </div>
        <div
          #droppableElement
          mwlDroppable
          (dragEnter)="dragEvent('enter', $event)"
          (dragOver)="dragEvent('over', $event)"
          (dragLeave)="dragEvent('leave', $event)"
          (drop)="drop($event)"
          [dragOverClass]="dragOverClass"
          [dragActiveClass]="dragActiveClass">
          Drop here
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
  class ScrollTestComponent extends TestComponent {
    @ViewChild(DraggableScrollContainerDirective)
    scrollContainer: DraggableScrollContainerDirective;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DragAndDropModule],
      declarations: [TestComponent, ScrollTestComponent]
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
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
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
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
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
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
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
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
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
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    const droppableElement =
      fixture.componentInstance.droppableElement.nativeElement;
    expect(droppableElement.classList.contains('drag-over')).to.be.false;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 10 });
    expect(droppableElement.classList.contains('drag-over')).to.be.false;
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 100
    });
    expect(droppableElement.classList.contains('drag-over')).to.be.true;
    triggerDomEvent('mouseup', draggableElement, { clientX: 5, clientY: 120 });
    expect(droppableElement.classList.contains('drag-over')).to.be.false;
  });

  it('should fire the drag end event before the drop event', () => {
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 120
    });
    triggerDomEvent('mouseup', draggableElement, { clientX: 5, clientY: 120 });
    sinon.assert.callOrder(
      fixture.componentInstance.dragEnd,
      fixture.componentInstance.drop
    );
  });

  it('should add a class to the droppable element when an element is being dragged anywhere', () => {
    fixture.componentInstance.dragActiveClass = 'drag-active';
    fixture.detectChanges();
    const draggableElement =
      fixture.componentInstance.draggableElement.nativeElement;
    const droppableElement =
      fixture.componentInstance.droppableElement.nativeElement;
    expect(droppableElement.classList.contains('drag-active')).to.be.false;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    triggerDomEvent('mousemove', draggableElement, { clientX: 5, clientY: 10 });
    expect(droppableElement.classList.contains('drag-active')).to.be.true;
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 100
    });
    expect(droppableElement.classList.contains('drag-active')).to.be.true;
    triggerDomEvent('mouseup', draggableElement, { clientX: 5, clientY: 120 });
    expect(droppableElement.classList.contains('drag-active')).to.be.false;
  });

  it('should not throw when destroying an immediately created element', () => {
    fixture = TestBed.createComponent(TestComponent);
    expect(() => fixture.destroy()).not.to.throw();
  });

  it('should link the droppable element to the scroll container', () => {
    const scrollFixture = TestBed.createComponent(ScrollTestComponent);
    scrollFixture.detectChanges();
    expect(
      scrollFixture.componentInstance.droppable['scrollContainer']
    ).to.equal(scrollFixture.componentInstance.scrollContainer);
  });

  it('should handle the scroll container being scrolled while dragging', () => {
    const scrollFixture = TestBed.createComponent(ScrollTestComponent);
    scrollFixture.detectChanges();
    document.body.appendChild(scrollFixture.nativeElement);
    const draggableElement =
      scrollFixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 11
    });
    scrollFixture.componentInstance.scrollContainer.elementRef.nativeElement.scrollTop = 150;
    scrollFixture.debugElement
      .query(By.directive(DraggableScrollContainerDirective))
      .triggerEventHandler('scroll', {});
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 10
    });
    triggerDomEvent('mouseup', draggableElement, { clientX: 5, clientY: 10 });
    expect(scrollFixture.componentInstance.drop).to.have.been.calledWith({
      dropData: { foo: 'bar' }
    });
  });

  it('should not fire drop events when the element is scrolled out of the view', () => {
    const scrollFixture = TestBed.createComponent(ScrollTestComponent);
    scrollFixture.detectChanges();
    document.body.appendChild(scrollFixture.nativeElement);
    const draggableElement =
      scrollFixture.componentInstance.draggableElement.nativeElement;
    triggerDomEvent('mousedown', draggableElement, { clientX: 5, clientY: 10 });
    triggerDomEvent('mousemove', draggableElement, {
      clientX: 5,
      clientY: 150
    });
    triggerDomEvent('mouseup', draggableElement, { clientX: 5, clientY: 150 });
    expect(scrollFixture.componentInstance.drop).not.to.have.been.called;
  });
});
