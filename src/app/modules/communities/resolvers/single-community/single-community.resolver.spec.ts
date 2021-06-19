import { TestBed } from '@angular/core/testing'

import { SingleCommunityResolver } from './single-community.resolver'

describe('SingleCommunityResolver', () => {
  let resolver: SingleCommunityResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SingleCommunityResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
