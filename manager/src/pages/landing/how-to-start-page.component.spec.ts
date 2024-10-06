import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToStartPageComponent } from './how-to-start-page.component';

describe('HowToStartPageComponent', () => {
  let component: HowToStartPageComponent;
  let fixture: ComponentFixture<HowToStartPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToStartPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowToStartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
