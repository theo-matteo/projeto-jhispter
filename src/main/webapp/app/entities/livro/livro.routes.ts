import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import LivroResolve from './route/livro-routing-resolve.service';

const livroRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/livro.component').then(m => m.LivroComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/livro-detail.component').then(m => m.LivroDetailComponent),
    resolve: {
      livro: LivroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/livro-update.component').then(m => m.LivroUpdateComponent),
    resolve: {
      livro: LivroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/livro-update.component').then(m => m.LivroUpdateComponent),
    resolve: {
      livro: LivroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default livroRoute;
