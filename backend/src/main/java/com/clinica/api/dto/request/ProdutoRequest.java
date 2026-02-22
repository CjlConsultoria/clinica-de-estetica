package com.clinica.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProdutoRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Fabricante é obrigatório")
    private String fabricante;

    private String categoria;
    private String unidade;
    private String registroAnvisa;
    private String descricao;
}
