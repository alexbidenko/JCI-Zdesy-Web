import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenedEventComponent } from './opened-event.component';

describe('OpenedEventComponent', () => {
  let component: OpenedEventComponent;
  let fixture: ComponentFixture<OpenedEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenedEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
