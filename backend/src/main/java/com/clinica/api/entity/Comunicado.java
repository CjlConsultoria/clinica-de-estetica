package com.clinica.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comunicados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comunicado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String conteudo;

    @Column(nullable = false)
    @Builder.Default
    private String tipo = "info";

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(name = "criado_por")
    private Long criadoPor;

    @Column(name = "nome_autor")
    private String nomeAutor;

    @Column(nullable = false)
    @Builder.Default
    private String status = "enviado";

    @Column(name = "destinatarios_json", columnDefinition = "TEXT")
    @Builder.Default
    private String destinatariosJson = "todas";

    @Column(name = "data_agendamento")
    private LocalDateTime dataAgendamento;

    @Column(name = "lidas_count", nullable = false)
    @Builder.Default
    private Integer lidasCount = 0;

    @Column(name = "total_destinatarios", nullable = false)
    @Builder.Default
    private Integer totalDestinatarios = 0;

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
