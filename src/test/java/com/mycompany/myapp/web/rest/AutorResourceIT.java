package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.AutorAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Autor;
import com.mycompany.myapp.repository.AutorRepository;
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
 * Integration tests for the {@link AutorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AutorResourceIT {

    private static final String DEFAULT_NOME_AUTOR = "AAAAAAAAAA";
    private static final String UPDATED_NOME_AUTOR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/autors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAutorMockMvc;

    private Autor autor;

    private Autor insertedAutor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Autor createEntity() {
        return new Autor().nomeAutor(DEFAULT_NOME_AUTOR);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Autor createUpdatedEntity() {
        return new Autor().nomeAutor(UPDATED_NOME_AUTOR);
    }

    @BeforeEach
    public void initTest() {
        autor = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedAutor != null) {
            autorRepository.delete(insertedAutor);
            insertedAutor = null;
        }
    }

    @Test
    @Transactional
    void createAutor() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Autor
        var returnedAutor = om.readValue(
            restAutorMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autor)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Autor.class
        );

        // Validate the Autor in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAutorUpdatableFieldsEquals(returnedAutor, getPersistedAutor(returnedAutor));

        insertedAutor = returnedAutor;
    }

    @Test
    @Transactional
    void createAutorWithExistingId() throws Exception {
        // Create the Autor with an existing ID
        autor.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAutorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autor)))
            .andExpect(status().isBadRequest());

        // Validate the Autor in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeAutorIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        autor.setNomeAutor(null);

        // Create the Autor, which fails.

        restAutorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autor)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAutors() throws Exception {
        // Initialize the database
        insertedAutor = autorRepository.saveAndFlush(autor);

        // Get all the autorList
        restAutorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(autor.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomeAutor").value(hasItem(DEFAULT_NOME_AUTOR)));
    }

    @Test
    @Transactional
    void getAutor() throws Exception {
        // Initialize the database
        insertedAutor = autorRepository.saveAndFlush(autor);

        // Get the autor
        restAutorMockMvc
            .perform(get(ENTITY_API_URL_ID, autor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(autor.getId().intValue()))
            .andExpect(jsonPath("$.nomeAutor").value(DEFAULT_NOME_AUTOR));
    }

    @Test
    @Transactional
    void getNonExistingAutor() throws Exception {
        // Get the autor
        restAutorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAutor() throws Exception {
        // Initialize the database
        insertedAutor = autorRepository.saveAndFlush(autor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the autor
        Autor updatedAutor = autorRepository.findById(autor.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAutor are not directly saved in db
        em.detach(updatedAutor);
        updatedAutor.nomeAutor(UPDATED_NOME_AUTOR);

        restAutorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAutor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAutor))
            )
            .andExpect(status().isOk());

        // Validate the Autor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAutorToMatchAllProperties(updatedAutor);
    }

    @Test
    @Transactional
    void putNonExistingAutor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autor.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAutorMockMvc
            .perform(put(ENTITY_API_URL_ID, autor.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autor)))
            .andExpect(status().isBadRequest());

        // Validate the Autor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAutor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(autor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Autor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAutor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(autor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Autor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAutorWithPatch() throws Exception {
        // Initialize the database
        insertedAutor = autorRepository.saveAndFlush(autor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the autor using partial update
        Autor partialUpdatedAutor = new Autor();
        partialUpdatedAutor.setId(autor.getId());

        restAutorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAutor.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAutor))
            )
            .andExpect(status().isOk());

        // Validate the Autor in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAutorUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAutor, autor), getPersistedAutor(autor));
    }

    @Test
    @Transactional
    void fullUpdateAutorWithPatch() throws Exception {
        // Initialize the database
        insertedAutor = autorRepository.saveAndFlush(autor);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the autor using partial update
        Autor partialUpdatedAutor = new Autor();
        partialUpdatedAutor.setId(autor.getId());

        partialUpdatedAutor.nomeAutor(UPDATED_NOME_AUTOR);

        restAutorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAutor.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAutor))
            )
            .andExpect(status().isOk());

        // Validate the Autor in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAutorUpdatableFieldsEquals(partialUpdatedAutor, getPersistedAutor(partialUpdatedAutor));
    }

    @Test
    @Transactional
    void patchNonExistingAutor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autor.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAutorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, autor.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(autor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Autor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAutor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(autor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Autor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAutor() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        autor.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAutorMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(autor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Autor in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAutor() throws Exception {
        // Initialize the database
        insertedAutor = autorRepository.saveAndFlush(autor);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the autor
        restAutorMockMvc
            .perform(delete(ENTITY_API_URL_ID, autor.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return autorRepository.count();
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

    protected Autor getPersistedAutor(Autor autor) {
        return autorRepository.findById(autor.getId()).orElseThrow();
    }

    protected void assertPersistedAutorToMatchAllProperties(Autor expectedAutor) {
        assertAutorAllPropertiesEquals(expectedAutor, getPersistedAutor(expectedAutor));
    }

    protected void assertPersistedAutorToMatchUpdatableProperties(Autor expectedAutor) {
        assertAutorAllUpdatablePropertiesEquals(expectedAutor, getPersistedAutor(expectedAutor));
    }
}
