import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EstudanteResolve from './route/estudante-routing-resolve.service';

const estudanteRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/estudante.component').then(m => m.EstudanteComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/estudante-detail.component').then(m => m.EstudanteDetailComponent),
    resolve: {
      estudante: EstudanteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/estudante-update.component').then(m => m.EstudanteUpdateComponent),
    resolve: {
      estudante: EstudanteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/estudante-update.component').then(m => m.EstudanteUpdateComponent),
    resolve: {
      estudante: EstudanteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default estudanteRoute;
