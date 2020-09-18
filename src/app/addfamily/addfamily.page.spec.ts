import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddfamilyPage } from './addfamily.page';

describe('AddfamilyPage', () => {
  let component: AddfamilyPage;
  let fixture: ComponentFixture<AddfamilyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfamilyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddfamilyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
