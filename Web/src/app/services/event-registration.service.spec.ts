import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { EventRegistrationService } from './event-registration.service';

describe('EventRegistrationService', () => {
  let service: EventRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EventRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
