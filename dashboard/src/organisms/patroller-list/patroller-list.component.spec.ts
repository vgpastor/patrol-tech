import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrollerListComponent } from './patroller-list.component';

describe('PatrollerListComponent', () => {
  let component: PatrollerListComponent;
  let fixture: ComponentFixture<PatrollerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatrollerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatrollerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
