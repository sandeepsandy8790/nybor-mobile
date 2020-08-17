import { TestBed } from '@angular/core/testing';

import { LoadingspinnerService } from './loadingspinner.service';

describe('LoadingspinnerService', () => {
  let service: LoadingspinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingspinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
