package com.clinica.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SuporteTicketRequest {
    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    private String categoria = "operacional";
    private String prioridade = "media";
    private Long empresaId;
    private String empresaNome;
}
