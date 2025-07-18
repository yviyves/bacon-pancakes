import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFight } from './new-fight';

describe('NewFight', () => {
  let component: NewFight;
  let fixture: ComponentFixture<NewFight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
