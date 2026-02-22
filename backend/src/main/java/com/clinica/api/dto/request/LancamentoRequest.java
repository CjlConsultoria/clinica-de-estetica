package com.clinica.api.dto.request;

import com.clinica.api.enums.FormaPagamento;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class LancamentoRequest {

    private Long agendamentoId;

    @NotNull(message = "Paciente é obrigatório")
    private Long pacienteId;

    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser positivo")
    private BigDecimal valor;

    private BigDecimal valorDesconto = BigDecimal.ZERO;

    private FormaPagamento formaPagamento;

    private LocalDate dataVencimento;

    private String descricao;

    private String observacoes;
}
