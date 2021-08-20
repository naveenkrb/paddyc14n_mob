import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SynchronizeDataPage } from './synchronize-data.page';

const routes: Routes = [
  {
    path: '',
    component: SynchronizeDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SynchronizeDataPageRoutingModule {}
