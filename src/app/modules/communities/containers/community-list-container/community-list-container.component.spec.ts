import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunityListContainerComponent } from './community-list-container.component'

describe('CommunityListContainerComponent', () => {
  let component: CommunityListContainerComponent;
  let fixture: ComponentFixture<CommunityListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
