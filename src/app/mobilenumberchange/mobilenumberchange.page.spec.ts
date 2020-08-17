import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobilenumberchangePage } from './mobilenumberchange.page';

describe('MobilenumberchangePage', () => {
  let component: MobilenumberchangePage;
  let fixture: ComponentFixture<MobilenumberchangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilenumberchangePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MobilenumberchangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
