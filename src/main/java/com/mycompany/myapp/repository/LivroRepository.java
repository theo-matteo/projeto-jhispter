package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Livro;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Livro entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {}
