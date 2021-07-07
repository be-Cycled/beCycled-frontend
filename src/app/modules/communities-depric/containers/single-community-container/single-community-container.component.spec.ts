import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SingleCommunityContainerComponent } from './single-community-container.component'

describe('SingleCommunityContainerComponent', () => {
  let component: SingleCommunityContainerComponent;
  let fixture: ComponentFixture<SingleCommunityContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleCommunityContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCommunityContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
