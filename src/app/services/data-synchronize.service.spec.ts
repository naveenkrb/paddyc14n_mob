import { TestBed } from '@angular/core/testing';

import { DataSynchronizeService } from './data-synchronize.service';

describe('DataSynchronizeService', () => {
  let service: DataSynchronizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSynchronizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
