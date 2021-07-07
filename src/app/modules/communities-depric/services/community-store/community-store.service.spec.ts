import { TestBed } from '@angular/core/testing'

import { CommunityStore } from './community-store.service'

describe('CommunityStoreService', () => {
  let service: CommunityStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
