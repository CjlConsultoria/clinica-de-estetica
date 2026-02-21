package com.clinica.api.entity;

import com.clinica.api.enums.StatusAlerta;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertas_reaplicacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertaReaplicacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aplicacao_id", nullable = false)
    private AplicacaoProduto aplicacao;

    @Column(name = "data_alerta", nullable = false)
    private LocalDate dataAlerta;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAlerta status = StatusAlerta.PENDENTE;

    @Builder.Default
    @Column(nullable = false)
    private boolean lido = false;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }
}
