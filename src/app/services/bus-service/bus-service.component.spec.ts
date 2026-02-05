import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusServiceComponent } from './bus-service.component';

describe('BusServiceComponent', () => {
  let component: BusServiceComponent;
  let fixture: ComponentFixture<BusServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusServiceComponent]
    });
    fixture = TestBed.createComponent(BusServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
