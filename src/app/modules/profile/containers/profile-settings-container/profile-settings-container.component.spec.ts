import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileSettingsContainerComponent } from './profile-settings-container.component'

describe('ProfileSettingsContainerComponent', () => {
  let component: ProfileSettingsContainerComponent;
  let fixture: ComponentFixture<ProfileSettingsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileSettingsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
