package com.clinica.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "empresas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String email;

    private String telefone;

    private String cnpj;

    private String responsavel;

    private String plano;

    private BigDecimal valor;

    private String status;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_vencimento")
    private LocalDate vencimento;

    @Column(name = "proxima_cobranca")
    private LocalDate proximaCobranca;

    private Integer usuarios;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "admin_nome")
    private String adminNome;

    @Column(name = "admin_email")
    private String adminEmail;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
        if (this.dataInicio == null) this.dataInicio = LocalDate.now();
        if (this.vencimento == null) this.vencimento = LocalDate.now().plusDays(30);
        if (this.proximaCobranca == null) this.proximaCobranca = this.vencimento;
        if (this.ativo == null) this.ativo = true;
        if (this.usuarios == null) this.usuarios = 1;
        if (this.status == null) this.status = "ativo";
    }

    @PreUpdate
    public void preUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }
}
