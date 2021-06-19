import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunityCreationComponent } from './community-creation.component'

describe('CommunityCreationComponent', () => {
  let component: CommunityCreationComponent;
  let fixture: ComponentFixture<CommunityCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
