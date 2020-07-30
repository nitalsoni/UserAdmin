import { TestBed } from '@angular/core/testing';

import { AppHttpInterceptorService } from './app-http-interceptor.service';

describe('AppHttpInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppHttpInterceptorService = TestBed.get(AppHttpInterceptorService);
    expect(service).toBeTruthy();
  });
});
