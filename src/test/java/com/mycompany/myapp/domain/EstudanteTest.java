package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EmprestimoTestSamples.*;
import static com.mycompany.myapp.domain.EstudanteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class EstudanteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Estudante.class);
        Estudante estudante1 = getEstudanteSample1();
        Estudante estudante2 = new Estudante();
        assertThat(estudante1).isNotEqualTo(estudante2);

        estudante2.setId(estudante1.getId());
        assertThat(estudante1).isEqualTo(estudante2);

        estudante2 = getEstudanteSample2();
        assertThat(estudante1).isNotEqualTo(estudante2);
    }

    @Test
    void estudanteTest() {
        Estudante estudante = getEstudanteRandomSampleGenerator();
        Emprestimo emprestimoBack = getEmprestimoRandomSampleGenerator();

        estudante.addEstudante(emprestimoBack);
        assertThat(estudante.getEstudantes()).containsOnly(emprestimoBack);
        assertThat(emprestimoBack.getEstudante()).isEqualTo(estudante);

        estudante.removeEstudante(emprestimoBack);
        assertThat(estudante.getEstudantes()).doesNotContain(emprestimoBack);
        assertThat(emprestimoBack.getEstudante()).isNull();

        estudante.estudantes(new HashSet<>(Set.of(emprestimoBack)));
        assertThat(estudante.getEstudantes()).containsOnly(emprestimoBack);
        assertThat(emprestimoBack.getEstudante()).isEqualTo(estudante);

        estudante.setEstudantes(new HashSet<>());
        assertThat(estudante.getEstudantes()).doesNotContain(emprestimoBack);
        assertThat(emprestimoBack.getEstudante()).isNull();
    }
}
