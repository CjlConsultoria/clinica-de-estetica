package com.clinica.api.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProcedimentoRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Código é obrigatório")
    private String codigo;

    @NotBlank(message = "Categoria é obrigatória")
    private String categoria;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    private Integer duracaoMinutos;

    private BigDecimal percentualComissao;

    private String descricao;
}
