import { TestBed } from '@angular/core/testing';

import { ScreenConfigItemService } from './screen-config-item.service';

describe('ScreenConfigItemDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScreenConfigItemService = TestBed.get(ScreenConfigItemService);
    expect(service).toBeTruthy();
  });
});
