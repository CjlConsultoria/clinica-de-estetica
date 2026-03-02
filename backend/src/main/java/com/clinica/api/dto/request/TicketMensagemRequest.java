package com.clinica.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketMensagemRequest {
    @NotBlank(message = "Texto é obrigatório")
    private String texto;

    private Boolean fromSupport = false;
}
