package com.clinica.api.dto.request;

import com.clinica.api.enums.StatusAgendamento;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AgendamentoStatusRequest {

    @NotNull(message = "Status é obrigatório")
    private StatusAgendamento status;

    private String motivoCancelamento;
}
