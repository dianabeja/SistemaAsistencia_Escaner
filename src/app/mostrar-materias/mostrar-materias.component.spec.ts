import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarMateriasComponent } from './mostrar-materias.component';

describe('MostrarMateriasComponent', () => {
  let component: MostrarMateriasComponent;
  let fixture: ComponentFixture<MostrarMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarMateriasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
