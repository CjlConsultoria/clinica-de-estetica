package com.clinica.api.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FaturaRequest {
    private Long empresaId;
    private String competencia;
    private BigDecimal valor;
    private String plano;
    private LocalDate vencimento;
    private String observacoes;
}
