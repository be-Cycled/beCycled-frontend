import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunitySingleUsersComponent } from './community-single-users.component'

describe('CommunitySingleUsersComponent', () => {
  let component: CommunitySingleUsersComponent;
  let fixture: ComponentFixture<CommunitySingleUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunitySingleUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySingleUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
