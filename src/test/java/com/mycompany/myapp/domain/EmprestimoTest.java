package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EmprestimoTestSamples.*;
import static com.mycompany.myapp.domain.EstudanteTestSamples.*;
import static com.mycompany.myapp.domain.LivroTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EmprestimoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Emprestimo.class);
        Emprestimo emprestimo1 = getEmprestimoSample1();
        Emprestimo emprestimo2 = new Emprestimo();
        assertThat(emprestimo1).isNotEqualTo(emprestimo2);

        emprestimo2.setId(emprestimo1.getId());
        assertThat(emprestimo1).isEqualTo(emprestimo2);

        emprestimo2 = getEmprestimoSample2();
        assertThat(emprestimo1).isNotEqualTo(emprestimo2);
    }

    @Test
    void estudanteTest() {
        Emprestimo emprestimo = getEmprestimoRandomSampleGenerator();
        Estudante estudanteBack = getEstudanteRandomSampleGenerator();

        emprestimo.setEstudante(estudanteBack);
        assertThat(emprestimo.getEstudante()).isEqualTo(estudanteBack);

        emprestimo.estudante(null);
        assertThat(emprestimo.getEstudante()).isNull();
    }

    @Test
    void livroTest() {
        Emprestimo emprestimo = getEmprestimoRandomSampleGenerator();
        Livro livroBack = getLivroRandomSampleGenerator();

        emprestimo.setLivro(livroBack);
        assertThat(emprestimo.getLivro()).isEqualTo(livroBack);

        emprestimo.livro(null);
        assertThat(emprestimo.getLivro()).isNull();
    }
}
