package com.clinica.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProntuarioResponse {

    private Long id;
    private Long pacienteId;
    private String pacienteNome;
    private Long medicoId;
    private String medicoNome;
    private Long agendamentoId;
    private String anamnese;
    private String exameFisico;
    private String diagnostico;
    private String cid10;
    private String prescricao;
    private String examesSolicitados;
    private String observacoes;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
