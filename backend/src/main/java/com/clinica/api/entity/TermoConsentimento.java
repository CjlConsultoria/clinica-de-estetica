package com.clinica.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "termos_consentimento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TermoConsentimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(nullable = false)
    private String versao;

    @Column(name = "empresa_id")
    private Long empresaId;

    @Column(name = "paciente_nome")
    private String pacienteNome;

    @Column(name = "profissional_nome")
    private String profissionalNome;

    @Builder.Default
    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @Builder.Default
    @OneToMany(mappedBy = "termo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AssinaturaConsentimento> assinaturas = new ArrayList<>();

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
