import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'estudante',
    data: { pageTitle: 'Estudantes' },
    loadChildren: () => import('./estudante/estudante.routes'),
  },
  {
    path: 'autor',
    data: { pageTitle: 'Autores' },
    loadChildren: () => import('./autor/autor.routes'),
  },
  {
    path: 'emprestimo',
    data: { pageTitle: 'Emprestimos' },
    loadChildren: () => import('./emprestimo/emprestimo.routes'),
  },
  {
    path: 'livro',
    data: { pageTitle: 'Livros' },
    loadChildren: () => import('./livro/livro.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
