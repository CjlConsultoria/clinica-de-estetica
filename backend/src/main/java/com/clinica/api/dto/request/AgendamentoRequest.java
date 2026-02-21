package com.clinica.api.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AgendamentoRequest {

    @NotNull(message = "Paciente é obrigatório")
    private Long pacienteId;

    @NotNull(message = "Médico é obrigatório")
    private Long medicoId;

    @NotNull(message = "Data e hora são obrigatórios")
    @Future(message = "Data deve ser no futuro")
    private LocalDateTime dataHora;

    private Integer duracaoMinutos = 30;

    private String tipoConsulta;

    private String observacoes;
}
