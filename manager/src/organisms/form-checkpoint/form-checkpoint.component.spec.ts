import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCheckpointComponent } from './form-checkpoint.component';

describe('FormCheckpointComponent', () => {
  let component: FormCheckpointComponent;
  let fixture: ComponentFixture<FormCheckpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCheckpointComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCheckpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
