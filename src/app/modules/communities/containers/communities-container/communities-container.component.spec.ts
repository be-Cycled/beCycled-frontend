import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CommunitiesContainerComponent } from './communities-container.component'

describe('CommunitiesContainerComponent', () => {
  let component: CommunitiesContainerComponent;
  let fixture: ComponentFixture<CommunitiesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunitiesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
