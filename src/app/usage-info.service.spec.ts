import { TestBed } from '@angular/core/testing';

import { UsageInfoService } from './services/usage-info.service';

describe('UsageInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsageInfoService = TestBed.get(UsageInfoService);
    expect(service).toBeTruthy();
  });
});
