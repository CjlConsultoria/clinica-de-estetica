package com.clinica.api.entity;

import com.clinica.api.enums.Sexo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pacientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    @Column(length = 20)
    private String telefone;

    @Column(length = 20)
    private String celular;

    @Column(unique = true)
    private String email;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;


    @Column(name = "convenio")
    private String convenio;

    @Column(name = "numero_carteirinha")
    private String numeroCarteirinha;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos = new ArrayList<>();

    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Prontuario> prontuarios = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }
}
