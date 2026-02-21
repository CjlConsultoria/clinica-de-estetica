package com.clinica.api.dto.response;

import com.clinica.api.enums.StatusAgendamento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgendamentoResponse {

    private Long id;
    private Long pacienteId;
    private String pacienteNome;
    private Long medicoId;
    private String medicoNome;
    private LocalDateTime dataHora;
    private Integer duracaoMinutos;
    private StatusAgendamento status;
    private String tipoConsulta;
    private String observacoes;
    private String motivoCancelamento;
    private LocalDateTime criadoEm;
}
