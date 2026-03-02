package com.clinica.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "faturas_assinaturas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaturaAssinatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    private String competencia;

    private BigDecimal valor;

    private String plano;

    @Column(name = "data_vencimento")
    private LocalDate vencimento;

    @Column(name = "data_pagamento")
    private LocalDate pagamento;

    private String status;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.status == null) this.status = "pendente";
    }
}
