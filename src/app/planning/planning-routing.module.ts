import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanningPage } from './planning.page';

const routes: Routes = [
  {
    path: '',
    component: PlanningPage
  },
  {
    path: 'crop-selection/:seasonCode',
    loadChildren: () => import('./crop-selection/crop-selection.module').then( m => m.CropSelectionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanningPageRoutingModule {}
