package com.clinica.api.entity;

import com.clinica.api.enums.StatusLote;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lotes_produto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoteProduto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(name = "numero_lote", nullable = false)
    private String numeroLote;

    @Column(name = "data_fabricacao")
    private LocalDate dataFabricacao;

    @Column(name = "data_validade", nullable = false)
    private LocalDate dataValidade;

    @Column(name = "quantidade_total", nullable = false)
    private Integer quantidadeTotal;

    @Column(name = "quantidade_atual", nullable = false)
    private Integer quantidadeAtual;

    private String fornecedor;

    @Column(name = "nota_fiscal")
    private String notaFiscal;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusLote status = StatusLote.ATIVO;

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
