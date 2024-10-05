import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPatrollerComponent } from './form-patroller.component';

describe('FormPatrollerComponent', () => {
  let component: FormPatrollerComponent;
  let fixture: ComponentFixture<FormPatrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPatrollerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPatrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
