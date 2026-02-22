package com.clinica.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "assinaturas_consentimento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssinaturaConsentimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "termo_id", nullable = false)
    private TermoConsentimento termo;

    @Column(name = "hash_assinatura", nullable = false, unique = true, length = 64)
    private String hashAssinatura;

    @Column(name = "ip_origem", length = 45)
    private String ipOrigem;

    @Column(name = "data_assinatura", nullable = false)
    private LocalDateTime dataAssinatura;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }
}
