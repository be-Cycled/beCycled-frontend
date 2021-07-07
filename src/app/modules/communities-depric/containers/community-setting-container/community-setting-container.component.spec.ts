import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunitySettingContainerComponent } from './community-setting-container.component'

describe('CommunitySettingContainerComponent', () => {
  let component: CommunitySettingContainerComponent;
  let fixture: ComponentFixture<CommunitySettingContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunitySettingContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySettingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
