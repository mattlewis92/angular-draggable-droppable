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
        [dragSnapGrid]="dragSnapGrid"
        [ghostDragEnabled]="ghostDragEnabled"
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
    public dragSnapGrid: any = {};
    public ghostDragEnabled: boolean = true;

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
    expect(fixture.componentInstance.dragStart).not.to.have.been.called;
    expect(fixture.componentInstance.dragging).not.to.have.been.called;
    expect(draggableElement.style.transform).not.to.be.ok;
    triggerDomEvent('mouseup', draggableElement, {clientX: 7, clientY: 12});
    expect(fixture.componentInstance.dragEnd).not.to.have.been.called;
  });

  it('should snap all horizontal drags to a grid', () => {
    fixture.componentInstance.dragSnapGrid = {x: 10};
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 5, clientY: 10});
    triggerDomEvent('mousemove', draggableElement, {clientX: 7, clientY: 12});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 0, y: 2});
    triggerDomEvent('mousemove', draggableElement, {clientX: 14, clientY: 18});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 0, y: 8});
    triggerDomEvent('mousemove', draggableElement, {clientX: 15, clientY: 20});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 10, y: 10});
    triggerDomEvent('mousemove', draggableElement, {clientX: 16, clientY: 22});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 10, y: 12});
    triggerDomEvent('mouseup', draggableElement, {clientX: 16, clientY: 22});
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({x: 10, y: 12});
  });

  it('should snap all vertical drags to a grid', () => {
    fixture.componentInstance.dragSnapGrid = {y: 10};
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 10, clientY: 5});
    triggerDomEvent('mousemove', draggableElement, {clientX: 12, clientY: 7});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 2, y: 0});
    triggerDomEvent('mousemove', draggableElement, {clientX: 18, clientY: 14});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 8, y: 0});
    triggerDomEvent('mousemove', draggableElement, {clientX: 20, clientY: 15});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 10, y: 10});
    triggerDomEvent('mousemove', draggableElement, {clientX: 22, clientY: 16});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 12, y: 10});
    triggerDomEvent('mouseup', draggableElement, {clientX: 22, clientY: 16});
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({x: 12, y: 10});
  });

  it('should snap all vertical and horizontal drags to a grid', () => {
    fixture.componentInstance.dragSnapGrid = {y: 10, x: 10};
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 10, clientY: 5});
    triggerDomEvent('mousemove', draggableElement, {clientX: 20, clientY: 15});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 10, y: 10});
    triggerDomEvent('mousemove', draggableElement, {clientX: 22, clientY: 16});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 10, y: 10});
    triggerDomEvent('mouseup', draggableElement, {clientX: 22, clientY: 16});
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({x: 10, y: 10});
  });

  it('should disable the ghost dragging effect', () => {
    fixture.componentInstance.ghostDragEnabled = false;
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 5, clientY: 10});
    expect(fixture.componentInstance.dragStart).to.have.been.calledWith({x: 0, y: 0});
    triggerDomEvent('mousemove', draggableElement, {clientX: 7, clientY: 10});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 2, y: 0});
    expect(draggableElement.style.transform).not.to.ok;
    triggerDomEvent('mousemove', draggableElement, {clientX: 7, clientY: 8});
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 2, y: -2});
    expect(draggableElement.style.transform).not.to.ok;
    triggerDomEvent('mouseup', draggableElement, {clientX: 7, clientY: 8});
    expect(fixture.componentInstance.dragEnd).to.have.been.calledWith({x: 2, y: -2});
    expect(draggableElement.style.transform).not.to.ok;
  });

  it('should auto set the mouse cursor to the move icon on hover', () => {
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mouseenter', draggableElement);
    expect(draggableElement.style.cursor).to.equal('move');
    triggerDomEvent('mouseleave', draggableElement);
    expect(draggableElement.style.cursor).not.to.be.ok;
  });

  it('should not set the mouse cursor when the element cant be dragged', () => {
    fixture.componentInstance.dragAxis = {x: false, y: false};
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mouseenter', draggableElement);
    expect(draggableElement.style.cursor).not.to.be.ok;
  });

  it('should not call the dragging event multiple times with the same values', () => {
    fixture.componentInstance.dragSnapGrid = {y: 10, x: 10};
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 10, clientY: 5});
    triggerDomEvent('mousemove', draggableElement, {clientX: 12, clientY: 15});
    expect(fixture.componentInstance.dragging).to.have.been.calledOnce;
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 0, y: 10});
    triggerDomEvent('mousemove', draggableElement, {clientX: 18, clientY: 18});
    expect(fixture.componentInstance.dragging).to.have.been.calledOnce;
  });

  it('should not call the dragging event with {x: 0, y: 0}', () => {
    fixture.componentInstance.dragSnapGrid = {y: 10, x: 10};
    fixture.detectChanges();
    const draggableElement: HTMLElement = fixture.componentInstance.draggable.element.nativeElement;
    triggerDomEvent('mousedown', draggableElement, {clientX: 10, clientY: 5});
    triggerDomEvent('mousemove', draggableElement, {clientX: 12, clientY: 7});
    expect(fixture.componentInstance.dragging).not.to.have.been.called;
    triggerDomEvent('mousemove', draggableElement, {clientX: 12, clientY: 15});
    expect(fixture.componentInstance.dragging).to.have.been.calledOnce;
    expect(fixture.componentInstance.dragging).to.have.been.calledWith({x: 0, y: 10});
  });

});