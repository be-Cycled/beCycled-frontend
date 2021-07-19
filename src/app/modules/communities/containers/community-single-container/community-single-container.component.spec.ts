import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunitySingleContainerComponent } from './community-single-container.component'

describe('CommunitySingleContainerComponent', () => {
  let component: CommunitySingleContainerComponent;
  let fixture: ComponentFixture<CommunitySingleContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunitySingleContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySingleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
