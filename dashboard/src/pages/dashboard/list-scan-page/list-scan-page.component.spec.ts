import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScanPageComponent } from './list-scan-page.component';

describe('ListScanPageComponent', () => {
  let component: ListScanPageComponent;
  let fixture: ComponentFixture<ListScanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListScanPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListScanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
