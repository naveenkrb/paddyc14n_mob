import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObserveCharacterPage } from './observe-character.page';

const routes: Routes = [
  {
    path: '',
    component: ObserveCharacterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObserveCharacterPageRoutingModule {}
