package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Autor.
 */
@Entity
@Table(name = "autor")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Autor implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nome_autor", nullable = false)
    private String nomeAutor;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "autor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "autor", "livros" }, allowSetters = true)
    private Set<Livro> autors = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Autor id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeAutor() {
        return this.nomeAutor;
    }

    public Autor nomeAutor(String nomeAutor) {
        this.setNomeAutor(nomeAutor);
        return this;
    }

    public void setNomeAutor(String nomeAutor) {
        this.nomeAutor = nomeAutor;
    }

    public Set<Livro> getAutors() {
        return this.autors;
    }

    public void setAutors(Set<Livro> livros) {
        if (this.autors != null) {
            this.autors.forEach(i -> i.setAutor(null));
        }
        if (livros != null) {
            livros.forEach(i -> i.setAutor(this));
        }
        this.autors = livros;
    }

    public Autor autors(Set<Livro> livros) {
        this.setAutors(livros);
        return this;
    }

    public Autor addAutor(Livro livro) {
        this.autors.add(livro);
        livro.setAutor(this);
        return this;
    }

    public Autor removeAutor(Livro livro) {
        this.autors.remove(livro);
        livro.setAutor(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Autor)) {
            return false;
        }
        return getId() != null && getId().equals(((Autor) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Autor{" +
            "id=" + getId() +
            ", nomeAutor='" + getNomeAutor() + "'" +
            "}";
    }
}
