import { TestBed } from '@angular/core/testing'

import { SinglePostResolver } from './single-post.resolver'

describe('SinglePostResolver', () => {
  let resolver: SinglePostResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SinglePostResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
