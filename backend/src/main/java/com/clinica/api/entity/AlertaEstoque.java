package com.clinica.api.entity;

import com.clinica.api.enums.TipoAlertaEstoque;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alertas_estoque")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertaEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lote_id", nullable = false)
    private LoteProduto lote;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAlertaEstoque tipo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;

    @Column(name = "data_alerta", nullable = false)
    private LocalDateTime dataAlerta;

    @Builder.Default
    @Column(nullable = false)
    private boolean lido = false;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.dataAlerta == null) {
            this.dataAlerta = LocalDateTime.now();
        }
    }
}
