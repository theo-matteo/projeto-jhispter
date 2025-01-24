package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Estudante;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Estudante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EstudanteRepository extends JpaRepository<Estudante, Long> {}
