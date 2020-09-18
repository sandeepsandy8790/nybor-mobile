import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddfamilyPage } from './addfamily.page';

const routes: Routes = [
  {
    path: '',
    component: AddfamilyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddfamilyPageRoutingModule {}
