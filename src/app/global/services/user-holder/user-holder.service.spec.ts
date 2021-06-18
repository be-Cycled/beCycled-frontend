import { TestBed } from '@angular/core/testing'

import { UserHolderService } from './user-holder.service'

describe('UserHolderService', () => {
  let service: UserHolderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserHolderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
