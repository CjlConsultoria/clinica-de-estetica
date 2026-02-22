package com.clinica.api.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssinarTermoRequest {

    @NotNull(message = "Paciente é obrigatório")
    private Long pacienteId;

    @NotNull(message = "Termo é obrigatório")
    private Long termoId;
}
