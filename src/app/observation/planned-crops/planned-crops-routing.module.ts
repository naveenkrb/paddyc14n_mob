import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlannedCropsPage } from './planned-crops.page';

const routes: Routes = [
  {
    path: '',
    component: PlannedCropsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannedCropsPageRoutingModule {}
