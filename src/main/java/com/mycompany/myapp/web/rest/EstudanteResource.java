package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Estudante;
import com.mycompany.myapp.repository.EstudanteRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Estudante}.
 */
@RestController
@RequestMapping("/api/estudantes")
@Transactional
public class EstudanteResource {

    private static final Logger LOG = LoggerFactory.getLogger(EstudanteResource.class);

    private static final String ENTITY_NAME = "estudante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstudanteRepository estudanteRepository;

    public EstudanteResource(EstudanteRepository estudanteRepository) {
        this.estudanteRepository = estudanteRepository;
    }

    /**
     * {@code POST  /estudantes} : Create a new estudante.
     *
     * @param estudante the estudante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estudante, or with status {@code 400 (Bad Request)} if the estudante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Estudante> createEstudante(@Valid @RequestBody Estudante estudante) throws URISyntaxException {
        LOG.debug("REST request to save Estudante : {}", estudante);
        if (estudante.getId() != null) {
            throw new BadRequestAlertException("A new estudante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        estudante = estudanteRepository.save(estudante);
        return ResponseEntity.created(new URI("/api/estudantes/" + estudante.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, estudante.getId().toString()))
            .body(estudante);
    }

    /**
     * {@code PUT  /estudantes/:id} : Updates an existing estudante.
     *
     * @param id the id of the estudante to save.
     * @param estudante the estudante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estudante,
     * or with status {@code 400 (Bad Request)} if the estudante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estudante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Estudante> updateEstudante(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Estudante estudante
    ) throws URISyntaxException {
        LOG.debug("REST request to update Estudante : {}, {}", id, estudante);
        if (estudante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estudante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estudanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        estudante = estudanteRepository.save(estudante);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, estudante.getId().toString()))
            .body(estudante);
    }

    /**
     * {@code PATCH  /estudantes/:id} : Partial updates given fields of an existing estudante, field will ignore if it is null
     *
     * @param id the id of the estudante to save.
     * @param estudante the estudante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estudante,
     * or with status {@code 400 (Bad Request)} if the estudante is not valid,
     * or with status {@code 404 (Not Found)} if the estudante is not found,
     * or with status {@code 500 (Internal Server Error)} if the estudante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Estudante> partialUpdateEstudante(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Estudante estudante
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Estudante partially : {}, {}", id, estudante);
        if (estudante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estudante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estudanteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Estudante> result = estudanteRepository
            .findById(estudante.getId())
            .map(existingEstudante -> {
                if (estudante.getNomeEstudante() != null) {
                    existingEstudante.setNomeEstudante(estudante.getNomeEstudante());
                }
                if (estudante.getEmail() != null) {
                    existingEstudante.setEmail(estudante.getEmail());
                }
                if (estudante.getTelefone() != null) {
                    existingEstudante.setTelefone(estudante.getTelefone());
                }

                return existingEstudante;
            })
            .map(estudanteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, estudante.getId().toString())
        );
    }

    /**
     * {@code GET  /estudantes} : get all the estudantes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estudantes in body.
     */
    @GetMapping("")
    public List<Estudante> getAllEstudantes() {
        LOG.debug("REST request to get all Estudantes");
        return estudanteRepository.findAll();
    }

    /**
     * {@code GET  /estudantes/:id} : get the "id" estudante.
     *
     * @param id the id of the estudante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estudante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Estudante> getEstudante(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Estudante : {}", id);
        Optional<Estudante> estudante = estudanteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(estudante);
    }

    /**
     * {@code DELETE  /estudantes/:id} : delete the "id" estudante.
     *
     * @param id the id of the estudante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstudante(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Estudante : {}", id);
        estudanteRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
