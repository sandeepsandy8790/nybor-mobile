import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddfamilyPageRoutingModule } from './addfamily-routing.module';

import { AddfamilyPage } from './addfamily.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddfamilyPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddfamilyPage]
})
export class AddfamilyPageModule {}
