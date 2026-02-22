package com.clinica.api.entity;

import com.clinica.api.enums.FormaPagamento;
import com.clinica.api.enums.StatusPagamento;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lancamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lancamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "valor_desconto", precision = 10, scale = 2)
    private BigDecimal valorDesconto = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pagamento")
    private FormaPagamento formaPagamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPagamento status = StatusPagamento.PENDENTE;

    @Column(name = "data_vencimento")
    private LocalDate dataVencimento;

    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;

    @Column(length = 100)
    private String descricao;

    @Column(name = "numero_recibo", unique = true)
    private String numeroRecibo;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

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
