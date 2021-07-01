import { TestBed } from '@angular/core/testing'

import { ComponentStore } from './component-store.service'

describe('ComponentStoreService', () => {
  let service: ComponentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
