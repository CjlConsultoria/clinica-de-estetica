package com.clinica.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TermoRequest {

    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    @NotBlank(message = "Conteúdo é obrigatório")
    private String conteudo;

    @NotBlank(message = "Versão é obrigatória")
    private String versao;
}
