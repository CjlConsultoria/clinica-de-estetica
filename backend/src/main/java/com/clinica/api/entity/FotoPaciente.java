package com.clinica.api.entity;

import com.clinica.api.enums.TipoFoto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fotos_paciente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FotoPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_foto", nullable = false)
    private TipoFoto tipoFoto;

    private String descricao;

    @Column(name = "nome_arquivo", nullable = false)
    private String nomeArquivo;

    @Column(name = "caminho_arquivo", nullable = false)
    private String caminhoArquivo;

    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.dataRegistro == null) {
            this.dataRegistro = LocalDate.now();
        }
    }
}
