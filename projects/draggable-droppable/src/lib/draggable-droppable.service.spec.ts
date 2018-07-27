import { TestBed, inject } from '@angular/core/testing';

import { DraggableDroppableService } from './draggable-droppable.service';

describe('DraggableDroppableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DraggableDroppableService]
    });
  });

  it('should be created', inject([DraggableDroppableService], (service: DraggableDroppableService) => {
    expect(service).toBeTruthy();
  }));
});
