package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Livro;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Livro entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {
    // Buscar livros pelo autor
    List<Livro> findAllByAutorId(Long autorId);
}
