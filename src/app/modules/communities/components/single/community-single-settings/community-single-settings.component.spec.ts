import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunitySingleSettingsComponent } from './community-single-settings.component'

describe('CommunitySingleSettingsComponent', () => {
  let component: CommunitySingleSettingsComponent;
  let fixture: ComponentFixture<CommunitySingleSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunitySingleSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySingleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
