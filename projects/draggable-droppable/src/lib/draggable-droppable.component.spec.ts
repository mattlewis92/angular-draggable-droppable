import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableDroppableComponent } from './draggable-droppable.component';

describe('DraggableDroppableComponent', () => {
  let component: DraggableDroppableComponent;
  let fixture: ComponentFixture<DraggableDroppableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraggableDroppableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraggableDroppableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
