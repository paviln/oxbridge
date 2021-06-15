import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ShipService } from './ship.service';

describe('ShipService', () => {
  let service: ShipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ShipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
