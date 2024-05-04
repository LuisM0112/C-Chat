import { TestBed } from '@angular/core/testing';

import { CChatService } from './c-chat.service';

describe('CChatService', () => {
  let service: CChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
