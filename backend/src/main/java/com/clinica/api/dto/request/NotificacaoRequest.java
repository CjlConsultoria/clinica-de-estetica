package com.clinica.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NotificacaoRequest {
    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    private String descricao;

    @NotBlank(message = "Tipo é obrigatório")
    private String tipo;

    private String prioridade = "media";

    private Long empresaId;
    private String empresaNome;
}
