package com.clinica.api.dto.request;

import com.clinica.api.enums.FormaPagamento;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PagamentoRequest {

    @NotNull(message = "Forma de pagamento é obrigatória")
    private FormaPagamento formaPagamento;

    @NotNull(message = "Data de pagamento é obrigatória")
    private LocalDate dataPagamento;

    private String observacoes;
}
