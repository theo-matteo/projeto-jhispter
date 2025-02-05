package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class EmprestimoAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmprestimoAllPropertiesEquals(Emprestimo expected, Emprestimo actual) {
        assertEmprestimoAutoGeneratedPropertiesEquals(expected, actual);
        assertEmprestimoAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmprestimoAllUpdatablePropertiesEquals(Emprestimo expected, Emprestimo actual) {
        assertEmprestimoUpdatableFieldsEquals(expected, actual);
        assertEmprestimoUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmprestimoAutoGeneratedPropertiesEquals(Emprestimo expected, Emprestimo actual) {
        assertThat(expected)
            .as("Verify Emprestimo auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmprestimoUpdatableFieldsEquals(Emprestimo expected, Emprestimo actual) {
        assertThat(expected)
            .as("Verify Emprestimo relevant properties")
            .satisfies(e -> assertThat(e.getDataEmprestimo()).as("check dataEmprestimo").isEqualTo(actual.getDataEmprestimo()))
            .satisfies(e -> assertThat(e.getStatus()).as("check status").isEqualTo(actual.getStatus()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEmprestimoUpdatableRelationshipsEquals(Emprestimo expected, Emprestimo actual) {
        assertThat(expected)
            .as("Verify Emprestimo relationships")
            .satisfies(e -> assertThat(e.getEstudante()).as("check estudante").isEqualTo(actual.getEstudante()))
            .satisfies(e -> assertThat(e.getLivro()).as("check livro").isEqualTo(actual.getLivro()));
    }
}
