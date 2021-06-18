import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AfficheContainerComponent } from './affiche-container.component'

describe('AfficheContainerComponent', () => {
  let component: AfficheContainerComponent;
  let fixture: ComponentFixture<AfficheContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficheContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfficheContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
