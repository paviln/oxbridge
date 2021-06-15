import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { LocationRegistrationService } from './location-registration.service';

describe('LocationRegistrationService', () => {
  let service: LocationRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LocationRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
