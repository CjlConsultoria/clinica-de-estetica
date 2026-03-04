package com.clinica.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comunicado_leituras",
       uniqueConstraints = @UniqueConstraint(columnNames = {"comunicado_id", "usuario_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComunicadoLeitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comunicado_id", nullable = false)
    private Long comunicadoId;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "lido_em", nullable = false)
    private LocalDateTime lidoEm;

    @PrePersist
    public void prePersist() {
        this.lidoEm = LocalDateTime.now();
    }
}
