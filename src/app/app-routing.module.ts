import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AutoLoginGuard } from './auth/auto-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/observation',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule),
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'observation',
    loadChildren: () => import('./observation/observation.module').then(m => m.ObservationPageModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'planning',
    loadChildren: () => import('./planning/planning.module').then(m => m.PlanningPageModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
