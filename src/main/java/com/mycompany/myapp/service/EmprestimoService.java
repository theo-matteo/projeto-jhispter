package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Emprestimo;
import com.mycompany.myapp.domain.Livro;
import com.mycompany.myapp.repository.EmprestimoRepository;
import com.mycompany.myapp.repository.LivroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final LivroRepository livroRepository;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, LivroRepository livroRepository) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroRepository = livroRepository;
    }

    public Emprestimo createEmprestimo(Emprestimo emprestimo) {
        Livro livro = emprestimo.getLivro();

        if (livro.getQuantidade() <= 0) {
            throw new Error("Este livro não está disponível.");
        }
        // Decrementa a quantidade do livro e salva no banco de dados
        livro.setQuantidade(livro.getQuantidade() - 1);
        livroRepository.save(livro);

        // Salva o empréstimo
        return emprestimoRepository.save(emprestimo);
    }
}
