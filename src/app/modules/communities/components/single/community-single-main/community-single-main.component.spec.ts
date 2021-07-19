import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunitySingleMainComponent } from './community-single-main.component'

describe('CommunitySingleMainComponent', () => {
  let component: CommunitySingleMainComponent;
  let fixture: ComponentFixture<CommunitySingleMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunitySingleMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySingleMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
