import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EmprestimoResolve from './route/emprestimo-routing-resolve.service';

const emprestimoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/emprestimo.component').then(m => m.EmprestimoComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/emprestimo-detail.component').then(m => m.EmprestimoDetailComponent),
    resolve: {
      emprestimo: EmprestimoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/emprestimo-update.component').then(m => m.EmprestimoUpdateComponent),
    resolve: {
      emprestimo: EmprestimoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/emprestimo-update.component').then(m => m.EmprestimoUpdateComponent),
    resolve: {
      emprestimo: EmprestimoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default emprestimoRoute;
