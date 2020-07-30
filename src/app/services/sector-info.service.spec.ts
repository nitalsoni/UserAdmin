import { TestBed } from '@angular/core/testing';

import { SectorInfoService } from './sector-info.service';

describe('SectorInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SectorInfoService = TestBed.get(SectorInfoService);
    expect(service).toBeTruthy();
  });
});
