import { TestBed } from '@angular/core/testing';

import { ConfirmationServiceService } from './confirmation-service.service';

describe('ConfirmationServiceService', () => {
  let service: ConfirmationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
