import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarListasComponent } from './mostrar-listas.component';

describe('MostrarListasComponent', () => {
  let component: MostrarListasComponent;
  let fixture: ComponentFixture<MostrarListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostrarListasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
