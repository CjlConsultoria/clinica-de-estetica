package com.clinica.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "procedimentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Procedimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false, length = 20)
    private String codigo;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "duracao_minutos")
    private Integer duracaoMinutos;

    @Column(name = "percentual_comissao", precision = 5, scale = 2)
    private BigDecimal percentualComissao;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Builder.Default
    @Column(nullable = false)
    private boolean ativo = true;

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
