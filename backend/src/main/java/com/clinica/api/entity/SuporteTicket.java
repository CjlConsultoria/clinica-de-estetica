package com.clinica.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suporte_tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuporteTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descricao;

    @Column(nullable = false)
    @Builder.Default
    private String categoria = "operacional";

    @Column(nullable = false)
    @Builder.Default
    private String status = "aberto";

    @Column(nullable = false)
    @Builder.Default
    private String prioridade = "media";

    @Column(name = "criado_por")
    private Long criadoPor;

    @Column(name = "nome_autor")
    private String nomeAutor;

    @Column(name = "empresa_id")
    private Long empresaId;

    @Column(name = "empresa_nome")
    private String empresaNome;

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
