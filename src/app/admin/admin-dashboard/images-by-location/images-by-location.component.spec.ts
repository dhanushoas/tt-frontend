import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesByLocationComponent } from './images-by-location.component';

describe('ImagesByLocationComponent', () => {
  let component: ImagesByLocationComponent;
  let fixture: ComponentFixture<ImagesByLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImagesByLocationComponent]
    });
    fixture = TestBed.createComponent(ImagesByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
