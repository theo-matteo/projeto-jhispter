import { Component, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IAutor } from '../autor.model';

import { ILivro } from 'app/entities/livro/livro.model';
import { LivroService } from 'app/entities/livro/service/livro.service';
@Component({
  selector: 'jhi-autor-detail',
  templateUrl: './autor-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class AutorDetailComponent implements OnInit {
  autor = input<IAutor | null>(null);

  // Livros do autor
  livros: ILivro[] = [];

  constructor(private livroService: LivroService) {}

  ngOnInit(): void {
    const autorValue = this.autor();
    if (autorValue?.id) {
      // Carrega os livros do autor do autor
      this.loadLivrosAutor(autorValue.id);
    }
  }

  loadLivrosAutor(autorId: number): void {
    this.livroService.queryByAutor(autorId).subscribe({
      next: res => {
        this.livros = res.body ?? []; // Armazena os livros retornados
      },
      error(e) {
        console.error('Falha ao carregar os livros:', e);
      },
    });
  }

  previousState(): void {
    window.history.back();
  }
}
