import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenedPlaceComponent } from './opened-place.component';

describe('OpenedPlaceComponent', () => {
  let component: OpenedPlaceComponent;
  let fixture: ComponentFixture<OpenedPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenedPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenedPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
