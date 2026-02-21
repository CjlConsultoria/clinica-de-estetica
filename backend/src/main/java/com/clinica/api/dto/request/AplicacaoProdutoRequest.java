package com.clinica.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AplicacaoProdutoRequest {

    @NotNull(message = "Paciente é obrigatório")
    private Long pacienteId;

    private Long prontuarioId;

    @NotNull(message = "Lote é obrigatório")
    private Long loteId;

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser maior que zero")
    private Integer quantidade;

    @NotNull(message = "Data de aplicação é obrigatória")
    private LocalDate dataAplicacao;

    private LocalDate dataProximaAplicacao;
    private String observacoes;
}
