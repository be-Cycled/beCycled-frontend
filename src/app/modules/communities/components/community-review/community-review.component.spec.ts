import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunityReviewComponent } from './community-review.component'

describe('CommunityReviewComponent', () => {
  let component: CommunityReviewComponent;
  let fixture: ComponentFixture<CommunityReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
