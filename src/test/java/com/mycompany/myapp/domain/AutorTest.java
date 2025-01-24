package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AutorTestSamples.*;
import static com.mycompany.myapp.domain.LivroTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AutorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Autor.class);
        Autor autor1 = getAutorSample1();
        Autor autor2 = new Autor();
        assertThat(autor1).isNotEqualTo(autor2);

        autor2.setId(autor1.getId());
        assertThat(autor1).isEqualTo(autor2);

        autor2 = getAutorSample2();
        assertThat(autor1).isNotEqualTo(autor2);
    }

    @Test
    void autorTest() {
        Autor autor = getAutorRandomSampleGenerator();
        Livro livroBack = getLivroRandomSampleGenerator();

        autor.addAutor(livroBack);
        assertThat(autor.getAutors()).containsOnly(livroBack);
        assertThat(livroBack.getAutor()).isEqualTo(autor);

        autor.removeAutor(livroBack);
        assertThat(autor.getAutors()).doesNotContain(livroBack);
        assertThat(livroBack.getAutor()).isNull();

        autor.autors(new HashSet<>(Set.of(livroBack)));
        assertThat(autor.getAutors()).containsOnly(livroBack);
        assertThat(livroBack.getAutor()).isEqualTo(autor);

        autor.setAutors(new HashSet<>());
        assertThat(autor.getAutors()).doesNotContain(livroBack);
        assertThat(livroBack.getAutor()).isNull();
    }
}
