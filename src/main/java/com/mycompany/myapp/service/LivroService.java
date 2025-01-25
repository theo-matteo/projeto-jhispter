package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Livro;
import com.mycompany.myapp.repository.LivroRepository;
import org.springframework.stereotype.Service;

@Service
public class LivroService {

    private final LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }

    public void incrementaQuantidadeLivro(Livro livro) {
        livro.setQuantidade(livro.getQuantidade() + 1);
        livroRepository.save(livro);
    }
}
