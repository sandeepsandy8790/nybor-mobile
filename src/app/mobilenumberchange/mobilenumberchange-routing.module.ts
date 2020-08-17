import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MobilenumberchangePage } from './mobilenumberchange.page';

const routes: Routes = [
  {
    path: '',
    component: MobilenumberchangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobilenumberchangePageRoutingModule {}
