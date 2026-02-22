package com.clinica.api.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnvisaProdutoResponse {
    private String numRegistro;
    private String nomeProduto;
    private String empresa;
    private String situacao;
    private String vencimento;
    private String categoria;
    private String classe;
}
