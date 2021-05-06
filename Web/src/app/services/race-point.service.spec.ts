import { TestBed } from '@angular/core/testing';

import { RacePointService } from './race-point.service';

describe('RacePointService', () => {
  let service: RacePointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RacePointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
