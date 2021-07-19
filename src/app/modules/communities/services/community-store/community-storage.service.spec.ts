import { TestBed } from '@angular/core/testing'

import { CommunityStoreService } from './community-store.service'

describe('CommunityStorageService', () => {
  let service: CommunityStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
