package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.EstudanteAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Estudante;
import com.mycompany.myapp.repository.EstudanteRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EstudanteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EstudanteResourceIT {

    private static final String DEFAULT_NOME_ESTUDANTE = "AAAAAAAAAA";
    private static final String UPDATED_NOME_ESTUDANTE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEFONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/estudantes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EstudanteRepository estudanteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEstudanteMockMvc;

    private Estudante estudante;

    private Estudante insertedEstudante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estudante createEntity() {
        return new Estudante().nomeEstudante(DEFAULT_NOME_ESTUDANTE).email(DEFAULT_EMAIL).telefone(DEFAULT_TELEFONE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estudante createUpdatedEntity() {
        return new Estudante().nomeEstudante(UPDATED_NOME_ESTUDANTE).email(UPDATED_EMAIL).telefone(UPDATED_TELEFONE);
    }

    @BeforeEach
    public void initTest() {
        estudante = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedEstudante != null) {
            estudanteRepository.delete(insertedEstudante);
            insertedEstudante = null;
        }
    }

    @Test
    @Transactional
    void createEstudante() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Estudante
        var returnedEstudante = om.readValue(
            restEstudanteMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estudante)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Estudante.class
        );

        // Validate the Estudante in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEstudanteUpdatableFieldsEquals(returnedEstudante, getPersistedEstudante(returnedEstudante));

        insertedEstudante = returnedEstudante;
    }

    @Test
    @Transactional
    void createEstudanteWithExistingId() throws Exception {
        // Create the Estudante with an existing ID
        estudante.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEstudanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estudante)))
            .andExpect(status().isBadRequest());

        // Validate the Estudante in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeEstudanteIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        estudante.setNomeEstudante(null);

        // Create the Estudante, which fails.

        restEstudanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estudante)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        estudante.setEmail(null);

        // Create the Estudante, which fails.

        restEstudanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estudante)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTelefoneIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        estudante.setTelefone(null);

        // Create the Estudante, which fails.

        restEstudanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estudante)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEstudantes() throws Exception {
        // Initialize the database
        insertedEstudante = estudanteRepository.saveAndFlush(estudante);

        // Get all the estudanteList
        restEstudanteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(estudante.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomeEstudante").value(hasItem(DEFAULT_NOME_ESTUDANTE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].telefone").value(hasItem(DEFAULT_TELEFONE)));
    }

    @Test
    @Transactional
    void getEstudante() throws Exception {
        // Initialize the database
        insertedEstudante = estudanteRepository.saveAndFlush(estudante);

        // Get the estudante
        restEstudanteMockMvc
            .perform(get(ENTITY_API_URL_ID, estudante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(estudante.getId().intValue()))
            .andExpect(jsonPath("$.nomeEstudante").value(DEFAULT_NOME_ESTUDANTE))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.telefone").value(DEFAULT_TELEFONE));
    }

    @Test
    @Transactional
    void getNonExistingEstudante() throws Exception {
        // Get the estudante
        restEstudanteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEstudante() throws Exception {
        // Initialize the database
        insertedEstudante = estudanteRepository.saveAndFlush(estudante);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the estudante
        Estudante updatedEstudante = estudanteRepository.findById(estudante.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEstudante are not directly saved in db
        em.detach(updatedEstudante);
        updatedEstudante.nomeEstudante(UPDATED_NOME_ESTUDANTE).email(UPDATED_EMAIL).telefone(UPDATED_TELEFONE);

        restEstudanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEstudante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEstudante))
            )
            .andExpect(status().isOk());

        // Validate the Estudante in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEstudanteToMatchAllProperties(updatedEstudante);
    }

    @Test
    @Transactional
    void putNonExistingEstudante() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estudante.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstudanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, estudante.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estudante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estudante in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEstudante() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estudante.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(estudante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estudante in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEstudante() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estudante.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudanteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estudante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estudante in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEstudanteWithPatch() throws Exception {
        // Initialize the database
        insertedEstudante = estudanteRepository.saveAndFlush(estudante);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the estudante using partial update
        Estudante partialUpdatedEstudante = new Estudante();
        partialUpdatedEstudante.setId(estudante.getId());

        partialUpdatedEstudante.email(UPDATED_EMAIL);

        restEstudanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstudante.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEstudante))
            )
            .andExpect(status().isOk());

        // Validate the Estudante in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEstudanteUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEstudante, estudante),
            getPersistedEstudante(estudante)
        );
    }

    @Test
    @Transactional
    void fullUpdateEstudanteWithPatch() throws Exception {
        // Initialize the database
        insertedEstudante = estudanteRepository.saveAndFlush(estudante);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the estudante using partial update
        Estudante partialUpdatedEstudante = new Estudante();
        partialUpdatedEstudante.setId(estudante.getId());

        partialUpdatedEstudante.nomeEstudante(UPDATED_NOME_ESTUDANTE).email(UPDATED_EMAIL).telefone(UPDATED_TELEFONE);

        restEstudanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstudante.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEstudante))
            )
            .andExpect(status().isOk());

        // Validate the Estudante in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEstudanteUpdatableFieldsEquals(partialUpdatedEstudante, getPersistedEstudante(partialUpdatedEstudante));
    }

    @Test
    @Transactional
    void patchNonExistingEstudante() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estudante.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstudanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, estudante.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(estudante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estudante in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEstudante() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estudante.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(estudante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estudante in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEstudante() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estudante.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudanteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(estudante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estudante in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEstudante() throws Exception {
        // Initialize the database
        insertedEstudante = estudanteRepository.saveAndFlush(estudante);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the estudante
        restEstudanteMockMvc
            .perform(delete(ENTITY_API_URL_ID, estudante.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return estudanteRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Estudante getPersistedEstudante(Estudante estudante) {
        return estudanteRepository.findById(estudante.getId()).orElseThrow();
    }

    protected void assertPersistedEstudanteToMatchAllProperties(Estudante expectedEstudante) {
        assertEstudanteAllPropertiesEquals(expectedEstudante, getPersistedEstudante(expectedEstudante));
    }

    protected void assertPersistedEstudanteToMatchUpdatableProperties(Estudante expectedEstudante) {
        assertEstudanteAllUpdatablePropertiesEquals(expectedEstudante, getPersistedEstudante(expectedEstudante));
    }
}
