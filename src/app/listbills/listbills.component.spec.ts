import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListbillsComponent } from './listbills.component';

describe('ListbillsComponent', () => {
  let component: ListbillsComponent;
  let fixture: ComponentFixture<ListbillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListbillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListbillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
