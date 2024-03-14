import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPokerComponent } from './plan-poker.component';

describe('PlanPokerComponent', () => {
  let component: PlanPokerComponent;
  let fixture: ComponentFixture<PlanPokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanPokerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanPokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
