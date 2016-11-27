import {Component, ViewChild} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {triggerDomEvent} from './util';
import {DragAndDropModule} from '../src/index';
import {Draggable} from '../src/draggable.directive';

describe('draggable directive', () => {

  @Component({
    template: `
      <div 
        mwlDraggable
        [dragAxis]="dragAxis"
        (dragStart)="dragStart($event)" 
        (dragging)="dragging($event)"
        (dragEnd)="dragEnd($event)">
        Drag me!
      </div>`,
  })
  class TestCmp {

    @ViewChild(Draggable) public draggable: Draggable;
    public dragStart: sinon.SinonSpy = sinon.spy();
    public dragging: sinon.SinonSpy = sinon.spy();
    public dragEnd: sinon.SinonSpy = sinon.spy();
    public dragAxis: any = {x: true, y: true};

  }

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [DragAndDropModule], declarations: [TestCmp]});
  });

  let fixture: ComponentFixture<TestCmp>;
  beforeEach(() => {
    document.body.style.margin = '0px';
    fixture = TestBed.createComponent(TestCmp);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement.children[0]);
  });

  afterEach(() => {
    fixture.destroy();
    document.body.innerHTML = '';
  });

  it('should make the element draggable', () => {
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 5, clientY: 10});
    expect(fixture.componentInstance.dragStart).to.have.been.calledWith({x: 0, y: 0});
    triggerDomEvent('mousemove', draggableElement, {clientX: 7, clientY: 10});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 2, y: 0});
    expect(draggableElement.style.transform).to.equal('translate(2px, 0px)');
    triggerDomEvent('mousemove', draggableElement, {clientX: 7, clientY: 8});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 2, y: -2});
    expect(draggableElement.style.transform).to.equal('translate(2px, -2px)');
    triggerDomEvent('mouseup', draggableElement, {clientX: 7, clientY: 8});
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({x: 2, y: -2});
    expect(draggableElement.style.transform).to.equal('');
  });

  it('should end the mouseUp observable when the component is destroyed', () => {
    const complete: sinon.SinonSpy = sinon.spy();
    fixture.componentInstance.draggable.mouseUp.subscribe({complete});
    fixture.destroy();
    expect(complete).to.have.been.calledOnce;
  });

  it('should end the mouseDown observable when the component is destroyed', () => {
    const complete: sinon.SinonSpy = sinon.spy();
    fixture.componentInstance.draggable.mouseDown.subscribe({complete});
    fixture.destroy();
    expect(complete).to.have.been.calledOnce;
  });

  it('should end the mouseMove observable when the component is destroyed', () => {
    const complete: sinon.SinonSpy = sinon.spy();
    fixture.componentInstance.draggable.mouseMove.subscribe({complete});
    fixture.destroy();
    expect(complete).to.have.been.calledOnce;
  });

  it('should disable dragging along the x axis', () => {
    fixture.componentInstance.dragAxis = {x: false, y: true};
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 5, clientY: 10});
    triggerDomEvent('mousemove', draggableElement, {clientX: 7, clientY: 12});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 0, y: 2});
    expect(draggableElement.style.transform).to.equal('translate(0px, 2px)');
    triggerDomEvent('mouseup', draggableElement, {clientX: 7, clientY: 12});
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({x: 0, y: 2});
  });

  it('should disable dragging along the y axis', () => {
    fixture.componentInstance.dragAxis = {x: true, y: false};
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 5, clientY: 10});
    triggerDomEvent('mousemove', draggableElement, {clientX: 7, clientY: 12});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 2, y: 0});
    expect(draggableElement.style.transform).to.equal('translate(2px, 0px)');
    triggerDomEvent('mouseup', draggableElement, {clientX: 7, clientY: 12});
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({x: 2, y: 0});
  });

  it('should disable dragging', () => {
    fixture.componentInstance.dragAxis = {x: false, y: false};
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 5, clientY: 10});
    triggerDomEvent('mousemove', draggableElement, {clientX: 7, clientY: 12});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 0, y: 0});
    expect(draggableElement.style.transform).to.equal('translate(0px, 0px)');
    triggerDomEvent('mouseup', draggableElement, {clientX: 7, clientY: 12});
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({x: 0, y: 0});
  });

});