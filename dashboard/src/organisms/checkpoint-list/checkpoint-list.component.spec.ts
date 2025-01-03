import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpointListComponent } from './checkpoint-list.component';

describe('CheckpointListComponent', () => {
  let component: CheckpointListComponent;
  let fixture: ComponentFixture<CheckpointListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckpointListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckpointListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
