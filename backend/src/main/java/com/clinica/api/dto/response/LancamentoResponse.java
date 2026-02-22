package com.clinica.api.dto.response;

import com.clinica.api.enums.FormaPagamento;
import com.clinica.api.enums.StatusPagamento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LancamentoResponse {

    private Long id;
    private Long agendamentoId;
    private Long pacienteId;
    private String pacienteNome;
    private BigDecimal valor;
    private BigDecimal valorDesconto;
    private BigDecimal valorLiquido;
    private FormaPagamento formaPagamento;
    private StatusPagamento status;
    private LocalDate dataVencimento;
    private LocalDate dataPagamento;
    private String descricao;
    private String numeroRecibo;
    private String observacoes;
    private LocalDateTime criadoEm;
}
