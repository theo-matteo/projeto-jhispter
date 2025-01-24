package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.LivroAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Livro;
import com.mycompany.myapp.repository.LivroRepository;
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
 * Integration tests for the {@link LivroResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LivroResourceIT {

    private static final String DEFAULT_TITULO = "AAAAAAAAAA";
    private static final String UPDATED_TITULO = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTIDADE = 1;
    private static final Integer UPDATED_QUANTIDADE = 2;

    private static final String ENTITY_API_URL = "/api/livros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLivroMockMvc;

    private Livro livro;

    private Livro insertedLivro;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Livro createEntity() {
        return new Livro().titulo(DEFAULT_TITULO).quantidade(DEFAULT_QUANTIDADE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Livro createUpdatedEntity() {
        return new Livro().titulo(UPDATED_TITULO).quantidade(UPDATED_QUANTIDADE);
    }

    @BeforeEach
    public void initTest() {
        livro = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedLivro != null) {
            livroRepository.delete(insertedLivro);
            insertedLivro = null;
        }
    }

    @Test
    @Transactional
    void createLivro() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Livro
        var returnedLivro = om.readValue(
            restLivroMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(livro)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Livro.class
        );

        // Validate the Livro in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertLivroUpdatableFieldsEquals(returnedLivro, getPersistedLivro(returnedLivro));

        insertedLivro = returnedLivro;
    }

    @Test
    @Transactional
    void createLivroWithExistingId() throws Exception {
        // Create the Livro with an existing ID
        livro.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLivroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(livro)))
            .andExpect(status().isBadRequest());

        // Validate the Livro in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTituloIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        livro.setTitulo(null);

        // Create the Livro, which fails.

        restLivroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(livro)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkQuantidadeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        livro.setQuantidade(null);

        // Create the Livro, which fails.

        restLivroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(livro)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLivros() throws Exception {
        // Initialize the database
        insertedLivro = livroRepository.saveAndFlush(livro);

        // Get all the livroList
        restLivroMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(livro.getId().intValue())))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO)))
            .andExpect(jsonPath("$.[*].quantidade").value(hasItem(DEFAULT_QUANTIDADE)));
    }

    @Test
    @Transactional
    void getLivro() throws Exception {
        // Initialize the database
        insertedLivro = livroRepository.saveAndFlush(livro);

        // Get the livro
        restLivroMockMvc
            .perform(get(ENTITY_API_URL_ID, livro.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(livro.getId().intValue()))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO))
            .andExpect(jsonPath("$.quantidade").value(DEFAULT_QUANTIDADE));
    }

    @Test
    @Transactional
    void getNonExistingLivro() throws Exception {
        // Get the livro
        restLivroMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLivro() throws Exception {
        // Initialize the database
        insertedLivro = livroRepository.saveAndFlush(livro);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the livro
        Livro updatedLivro = livroRepository.findById(livro.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLivro are not directly saved in db
        em.detach(updatedLivro);
        updatedLivro.titulo(UPDATED_TITULO).quantidade(UPDATED_QUANTIDADE);

        restLivroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLivro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedLivro))
            )
            .andExpect(status().isOk());

        // Validate the Livro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLivroToMatchAllProperties(updatedLivro);
    }

    @Test
    @Transactional
    void putNonExistingLivro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        livro.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLivroMockMvc
            .perform(put(ENTITY_API_URL_ID, livro.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(livro)))
            .andExpect(status().isBadRequest());

        // Validate the Livro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLivro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        livro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(livro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLivro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        livro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivroMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(livro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Livro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLivroWithPatch() throws Exception {
        // Initialize the database
        insertedLivro = livroRepository.saveAndFlush(livro);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the livro using partial update
        Livro partialUpdatedLivro = new Livro();
        partialUpdatedLivro.setId(livro.getId());

        restLivroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLivro.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLivro))
            )
            .andExpect(status().isOk());

        // Validate the Livro in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLivroUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedLivro, livro), getPersistedLivro(livro));
    }

    @Test
    @Transactional
    void fullUpdateLivroWithPatch() throws Exception {
        // Initialize the database
        insertedLivro = livroRepository.saveAndFlush(livro);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the livro using partial update
        Livro partialUpdatedLivro = new Livro();
        partialUpdatedLivro.setId(livro.getId());

        partialUpdatedLivro.titulo(UPDATED_TITULO).quantidade(UPDATED_QUANTIDADE);

        restLivroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLivro.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLivro))
            )
            .andExpect(status().isOk());

        // Validate the Livro in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLivroUpdatableFieldsEquals(partialUpdatedLivro, getPersistedLivro(partialUpdatedLivro));
    }

    @Test
    @Transactional
    void patchNonExistingLivro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        livro.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLivroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, livro.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(livro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLivro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        livro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(livro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Livro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLivro() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        livro.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLivroMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(livro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Livro in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLivro() throws Exception {
        // Initialize the database
        insertedLivro = livroRepository.saveAndFlush(livro);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the livro
        restLivroMockMvc
            .perform(delete(ENTITY_API_URL_ID, livro.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return livroRepository.count();
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

    protected Livro getPersistedLivro(Livro livro) {
        return livroRepository.findById(livro.getId()).orElseThrow();
    }

    protected void assertPersistedLivroToMatchAllProperties(Livro expectedLivro) {
        assertLivroAllPropertiesEquals(expectedLivro, getPersistedLivro(expectedLivro));
    }

    protected void assertPersistedLivroToMatchUpdatableProperties(Livro expectedLivro) {
        assertLivroAllUpdatablePropertiesEquals(expectedLivro, getPersistedLivro(expectedLivro));
    }
}
