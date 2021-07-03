import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunityCreateContainerComponent } from './community-create-container.component'

describe('CommunityCreateContainerComponent', () => {
  let component: CommunityCreateContainerComponent;
  let fixture: ComponentFixture<CommunityCreateContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityCreateContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityCreateContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
