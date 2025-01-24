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
 * A Livro.
 */
@Entity
@Table(name = "livro")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Livro implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "titulo", nullable = false)
    private String titulo;

    @NotNull
    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "autors" }, allowSetters = true)
    private Autor autor;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "livro")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "estudante", "livro" }, allowSetters = true)
    private Set<Emprestimo> livros = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Livro id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return this.titulo;
    }

    public Livro titulo(String titulo) {
        this.setTitulo(titulo);
        return this;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Integer getQuantidade() {
        return this.quantidade;
    }

    public Livro quantidade(Integer quantidade) {
        this.setQuantidade(quantidade);
        return this;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Autor getAutor() {
        return this.autor;
    }

    public void setAutor(Autor autor) {
        this.autor = autor;
    }

    public Livro autor(Autor autor) {
        this.setAutor(autor);
        return this;
    }

    public Set<Emprestimo> getLivros() {
        return this.livros;
    }

    public void setLivros(Set<Emprestimo> emprestimos) {
        if (this.livros != null) {
            this.livros.forEach(i -> i.setLivro(null));
        }
        if (emprestimos != null) {
            emprestimos.forEach(i -> i.setLivro(this));
        }
        this.livros = emprestimos;
    }

    public Livro livros(Set<Emprestimo> emprestimos) {
        this.setLivros(emprestimos);
        return this;
    }

    public Livro addLivro(Emprestimo emprestimo) {
        this.livros.add(emprestimo);
        emprestimo.setLivro(this);
        return this;
    }

    public Livro removeLivro(Emprestimo emprestimo) {
        this.livros.remove(emprestimo);
        emprestimo.setLivro(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Livro)) {
            return false;
        }
        return getId() != null && getId().equals(((Livro) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Livro{" +
            "id=" + getId() +
            ", titulo='" + getTitulo() + "'" +
            ", quantidade=" + getQuantidade() +
            "}";
    }
}
