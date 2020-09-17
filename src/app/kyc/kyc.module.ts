import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KycPageRoutingModule } from './kyc-routing.module';

import { KycPage } from './kyc.page';
import { MediaCapture } from '@ionic-native/media-capture/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KycPageRoutingModule,
    ReactiveFormsModule,
  ],
  providers:[MediaCapture],
  declarations: [KycPage]
})
export class KycPageModule {}
