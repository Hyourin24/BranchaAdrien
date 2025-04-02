import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionrpComponent } from './sessionrp.component';

describe('SessionrpComponent', () => {
  let component: SessionrpComponent;
  let fixture: ComponentFixture<SessionrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionrpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
