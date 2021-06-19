import { TestBed } from '@angular/core/testing'

import { UserByTokenResolver } from './user-by-token.resolver'

describe('UserResolver', () => {
  let resolver: UserByTokenResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UserByTokenResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
