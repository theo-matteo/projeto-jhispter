package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AutorTestSamples.*;
import static com.mycompany.myapp.domain.EmprestimoTestSamples.*;
import static com.mycompany.myapp.domain.LivroTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class LivroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Livro.class);
        Livro livro1 = getLivroSample1();
        Livro livro2 = new Livro();
        assertThat(livro1).isNotEqualTo(livro2);

        livro2.setId(livro1.getId());
        assertThat(livro1).isEqualTo(livro2);

        livro2 = getLivroSample2();
        assertThat(livro1).isNotEqualTo(livro2);
    }

    @Test
    void autorTest() {
        Livro livro = getLivroRandomSampleGenerator();
        Autor autorBack = getAutorRandomSampleGenerator();

        livro.setAutor(autorBack);
        assertThat(livro.getAutor()).isEqualTo(autorBack);

        livro.autor(null);
        assertThat(livro.getAutor()).isNull();
    }

    @Test
    void livroTest() {
        Livro livro = getLivroRandomSampleGenerator();
        Emprestimo emprestimoBack = getEmprestimoRandomSampleGenerator();

        livro.addLivro(emprestimoBack);
        assertThat(livro.getLivros()).containsOnly(emprestimoBack);
        assertThat(emprestimoBack.getLivro()).isEqualTo(livro);

        livro.removeLivro(emprestimoBack);
        assertThat(livro.getLivros()).doesNotContain(emprestimoBack);
        assertThat(emprestimoBack.getLivro()).isNull();

        livro.livros(new HashSet<>(Set.of(emprestimoBack)));
        assertThat(livro.getLivros()).containsOnly(emprestimoBack);
        assertThat(emprestimoBack.getLivro()).isEqualTo(livro);

        livro.setLivros(new HashSet<>());
        assertThat(livro.getLivros()).doesNotContain(emprestimoBack);
        assertThat(emprestimoBack.getLivro()).isNull();
    }
}
