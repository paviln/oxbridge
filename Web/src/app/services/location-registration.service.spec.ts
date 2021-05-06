import { TestBed } from '@angular/core/testing';

import { LocationRegistrationService } from './location-registration.service';

describe('LocationRegistrationService', () => {
  let service: LocationRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
