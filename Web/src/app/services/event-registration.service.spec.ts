import { TestBed } from '@angular/core/testing';

import { EventRegistrationService } from './event-registration.service';

describe('EventRegistrationService', () => {
  let service: EventRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
