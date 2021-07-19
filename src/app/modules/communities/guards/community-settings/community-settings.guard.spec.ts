import { TestBed } from '@angular/core/testing'

import { CommunitySettingsGuard } from './community-settings.guard'

describe('CommunitySettingsGuard', () => {
  let guard: CommunitySettingsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CommunitySettingsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
