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
 * A Estudante.
 */
@Entity
@Table(name = "estudante")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Estudante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nome_estudante", nullable = false)
    private String nomeEstudante;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "telefone", nullable = false)
    private String telefone;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "estudante")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "estudante", "livro" }, allowSetters = true)
    private Set<Emprestimo> estudantes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Estudante id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeEstudante() {
        return this.nomeEstudante;
    }

    public Estudante nomeEstudante(String nomeEstudante) {
        this.setNomeEstudante(nomeEstudante);
        return this;
    }

    public void setNomeEstudante(String nomeEstudante) {
        this.nomeEstudante = nomeEstudante;
    }

    public String getEmail() {
        return this.email;
    }

    public Estudante email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return this.telefone;
    }

    public Estudante telefone(String telefone) {
        this.setTelefone(telefone);
        return this;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Set<Emprestimo> getEstudantes() {
        return this.estudantes;
    }

    public void setEstudantes(Set<Emprestimo> emprestimos) {
        if (this.estudantes != null) {
            this.estudantes.forEach(i -> i.setEstudante(null));
        }
        if (emprestimos != null) {
            emprestimos.forEach(i -> i.setEstudante(this));
        }
        this.estudantes = emprestimos;
    }

    public Estudante estudantes(Set<Emprestimo> emprestimos) {
        this.setEstudantes(emprestimos);
        return this;
    }

    public Estudante addEstudante(Emprestimo emprestimo) {
        this.estudantes.add(emprestimo);
        emprestimo.setEstudante(this);
        return this;
    }

    public Estudante removeEstudante(Emprestimo emprestimo) {
        this.estudantes.remove(emprestimo);
        emprestimo.setEstudante(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Estudante)) {
            return false;
        }
        return getId() != null && getId().equals(((Estudante) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Estudante{" +
            "id=" + getId() +
            ", nomeEstudante='" + getNomeEstudante() + "'" +
            ", email='" + getEmail() + "'" +
            ", telefone='" + getTelefone() + "'" +
            "}";
    }
}
