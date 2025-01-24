package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class EstudanteAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEstudanteAllPropertiesEquals(Estudante expected, Estudante actual) {
        assertEstudanteAutoGeneratedPropertiesEquals(expected, actual);
        assertEstudanteAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEstudanteAllUpdatablePropertiesEquals(Estudante expected, Estudante actual) {
        assertEstudanteUpdatableFieldsEquals(expected, actual);
        assertEstudanteUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEstudanteAutoGeneratedPropertiesEquals(Estudante expected, Estudante actual) {
        assertThat(expected)
            .as("Verify Estudante auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEstudanteUpdatableFieldsEquals(Estudante expected, Estudante actual) {
        assertThat(expected)
            .as("Verify Estudante relevant properties")
            .satisfies(e -> assertThat(e.getNomeEstudante()).as("check nomeEstudante").isEqualTo(actual.getNomeEstudante()))
            .satisfies(e -> assertThat(e.getEmail()).as("check email").isEqualTo(actual.getEmail()))
            .satisfies(e -> assertThat(e.getTelefone()).as("check telefone").isEqualTo(actual.getTelefone()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertEstudanteUpdatableRelationshipsEquals(Estudante expected, Estudante actual) {
        // empty method
    }
}
