import { TestBed } from '@angular/core/testing'

import { UserByLoginResolver } from './user-by-login.resolver'

describe('UserByLoginResolver', () => {
  let resolver: UserByLoginResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UserByLoginResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
