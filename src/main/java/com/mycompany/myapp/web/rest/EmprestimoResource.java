package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Emprestimo;
import com.mycompany.myapp.domain.Livro;
import com.mycompany.myapp.repository.EmprestimoRepository;
import com.mycompany.myapp.service.EmprestimoService; // Importa o EmprestimoService
import com.mycompany.myapp.service.LivroService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Emprestimo}.
 */
@RestController
@RequestMapping("/api/emprestimos")
@Transactional
public class EmprestimoResource {

    private static final Logger LOG = LoggerFactory.getLogger(EmprestimoResource.class);

    private static final String ENTITY_NAME = "emprestimo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmprestimoRepository emprestimoRepository;
    private final EmprestimoService emprestimoService;
    private final LivroService livroService;

    public EmprestimoResource(EmprestimoRepository emprestimoRepository, EmprestimoService emprestimoService, LivroService livroService) {
        this.emprestimoRepository = emprestimoRepository;
        this.emprestimoService = emprestimoService;
        this.livroService = livroService;
    }

    /**
     * {@code POST  /emprestimos} : Create a new emprestimo.
     *
     * @param emprestimo the emprestimo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emprestimo, or with status {@code 400 (Bad Request)} if the emprestimo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Emprestimo> createEmprestimo(@Valid @RequestBody Emprestimo emprestimo) throws URISyntaxException {
        LOG.debug("REST request to save Emprestimo : {}", emprestimo);
        if (emprestimo.getId() != null) {
            throw new BadRequestAlertException("Um novo empréstimo foi criado com o ID", ENTITY_NAME, "idexists");
        }
        Emprestimo result = emprestimoService.createEmprestimo(emprestimo);
        return ResponseEntity.created(new URI("/api/emprestimos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /emprestimos/:id} : Updates an existing emprestimo.
     *
     * @param id the id of the emprestimo to save.
     * @param emprestimo the emprestimo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emprestimo,
     * or with status {@code 400 (Bad Request)} if the emprestimo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the emprestimo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Emprestimo> updateEmprestimo(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Emprestimo emprestimo
    ) throws URISyntaxException {
        LOG.debug("REST request to update Emprestimo : {}, {}", id, emprestimo);
        if (emprestimo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emprestimo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emprestimoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        emprestimo = emprestimoRepository.save(emprestimo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, emprestimo.getId().toString()))
            .body(emprestimo);
    }

    /**
     * {@code PATCH  /emprestimos/:id} : Partial updates given fields of an existing emprestimo, field will ignore if it is null
     *
     * @param id the id of the emprestimo to save.
     * @param emprestimo the emprestimo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emprestimo,
     * or with status {@code 400 (Bad Request)} if the emprestimo is not valid,
     * or with status {@code 404 (Not Found)} if the emprestimo is not found,
     * or with status {@code 500 (Internal Server Error)} if the emprestimo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Emprestimo> partialUpdateEmprestimo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Emprestimo emprestimo
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Emprestimo partially : {}, {}", id, emprestimo);
        if (emprestimo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emprestimo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emprestimoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Emprestimo> result = emprestimoRepository
            .findById(emprestimo.getId())
            .map(existingEmprestimo -> {
                if (emprestimo.getDataEmprestimo() != null) {
                    existingEmprestimo.setDataEmprestimo(emprestimo.getDataEmprestimo());
                }
                if (emprestimo.getStatus() != null) {
                    existingEmprestimo.setStatus(emprestimo.getStatus());
                }

                return existingEmprestimo;
            })
            .map(emprestimoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, emprestimo.getId().toString())
        );
    }

    /**
     * {@code GET  /emprestimos} : get all the emprestimos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emprestimos in body.
     */
    @GetMapping("")
    public List<Emprestimo> getAllEmprestimos() {
        LOG.debug("REST request to get all Emprestimos");
        return emprestimoRepository.findAll();
    }

    /**
     * {@code GET  /emprestimos/:id} : get the "id" emprestimo.
     *
     * @param id the id of the emprestimo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emprestimo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Emprestimo> getEmprestimo(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Emprestimo : {}", id);
        Optional<Emprestimo> emprestimo = emprestimoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(emprestimo);
    }

    /**
     * {@code DELETE  /emprestimos/:id} : delete the "id" emprestimo.
     *
     * @param id the id of the emprestimo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmprestimo(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Emprestimo : {}", id);

        // Busca o emprestimo pelo id
        Optional<Emprestimo> emprestimo = emprestimoRepository.findById(id);

        // Caso o emprestimo exista, incrementa a quantidade do livro
        if (emprestimo.isPresent()) {
            Emprestimo existingEmprestimo = emprestimo.get();
            Livro livro = existingEmprestimo.getLivro();

            // Incrementa quantidade do livro no banco de dados
            livroService.incrementaQuantidadeLivro(livro);
        }

        emprestimoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
