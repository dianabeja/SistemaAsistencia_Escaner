import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should toggle valor_Camara when onSubmit is called', () => {
    // Initial value should be true
    expect(component.valor_Camara).toBe(true);

    // Calling onSubmit should toggle valor_Camara to false
    component.onSubmit();
    expect(component.valor_Camara).toBe(false);

    // Calling onSubmit again should toggle valor_Camara back to true
    component.onSubmit();
    expect(component.valor_Camara).toBe(true);
  });

});