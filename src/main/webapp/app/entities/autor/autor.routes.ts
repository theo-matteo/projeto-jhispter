import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AutorResolve from './route/autor-routing-resolve.service';

const autorRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/autor.component').then(m => m.AutorComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/autor-detail.component').then(m => m.AutorDetailComponent),
    resolve: {
      autor: AutorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/autor-update.component').then(m => m.AutorUpdateComponent),
    resolve: {
      autor: AutorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/autor-update.component').then(m => m.AutorUpdateComponent),
    resolve: {
      autor: AutorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default autorRoute;
