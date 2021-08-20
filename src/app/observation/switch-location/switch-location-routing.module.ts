import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwitchLocationPage } from './switch-location.page';

const routes: Routes = [
  {
    path: '',
    component: SwitchLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwitchLocationPageRoutingModule {}
