package com.clinica.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ComissaoResumoResponse {
    private Long usuarioId;
    private String usuarioNome;
    private BigDecimal percentualPadrao;
    private BigDecimal totalPendente;
    private long quantidadePendente;
}
