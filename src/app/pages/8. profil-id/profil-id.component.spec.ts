import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilIdComponent } from './profil-id.component';

describe('ProfilIdComponent', () => {
  let component: ProfilIdComponent;
  let fixture: ComponentFixture<ProfilIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
