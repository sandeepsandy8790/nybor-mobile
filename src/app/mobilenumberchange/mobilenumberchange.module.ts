import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MobilenumberchangePageRoutingModule } from './mobilenumberchange-routing.module';

import { MobilenumberchangePage } from './mobilenumberchange.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MobilenumberchangePageRoutingModule
  ],
  declarations: [MobilenumberchangePage]
})
export class MobilenumberchangePageModule {}
