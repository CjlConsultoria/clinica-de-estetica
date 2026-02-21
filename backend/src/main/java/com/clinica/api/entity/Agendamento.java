package com.clinica.api.entity;

import com.clinica.api.enums.StatusAgendamento;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id", nullable = false)
    private Usuario medico;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(name = "duracao_minutos")
    private Integer duracaoMinutos = 30;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAgendamento status = StatusAgendamento.AGENDADO;

    @Column(name = "tipo_consulta")
    private String tipoConsulta;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "motivo_cancelamento")
    private String motivoCancelamento;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @OneToOne(mappedBy = "agendamento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Lancamento lancamento;

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
