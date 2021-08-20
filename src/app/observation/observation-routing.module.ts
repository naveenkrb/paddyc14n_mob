import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservationPage } from './observation.page';

const routes: Routes = [
  {
    path: '',
    component: ObservationPage
  },
  {
    path: 'switch-location',
    loadChildren: () => import('./switch-location/switch-location.module').then(m => m.SwitchLocationPageModule)
  },
  {
    path: 'planned-crops/:planId',
    loadChildren: () => import('./planned-crops/planned-crops.module').then(m => m.PlannedCropsPageModule)
  },
  {
    path: 'crop-characters/:planId/:cropId',
    loadChildren: () => import('./crop-characters/crop-characters.module').then(m => m.CropCharactersPageModule)
  },
  {
    path: 'observe-character/:planId/:cropId/:characterId',
    loadChildren: () => import('./observe-character/observe-character.module').then(m => m.ObserveCharacterPageModule)
  },
  {
    path: 'synchronize-data',
    loadChildren: () => import('./synchronize-data/synchronize-data.module').then( m => m.SynchronizeDataPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObservationPageRoutingModule { }
