package com.clinica.api.dto.response;

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
public class FaturaResponse {
    private Long id;
    private Long empresaId;
    private String empresaNome;
    private String competencia;
    private BigDecimal valor;
    private String plano;
    private LocalDate vencimento;
    private LocalDate pagamento;
    private String status;
    private String observacoes;
    private LocalDateTime criadoEm;
}
