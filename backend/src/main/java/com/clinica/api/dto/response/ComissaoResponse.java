package com.clinica.api.dto.response;

import com.clinica.api.enums.StatusComissao;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ComissaoResponse {
    private Long id;
    private Long usuarioId;
    private String usuarioNome;
    private Long lancamentoId;
    private Long agendamentoId;
    private String procedimento;
    private String pacienteNome;
    private BigDecimal valorBase;
    private BigDecimal percentual;
    private BigDecimal valorComissao;
    private StatusComissao status;
    private LocalDate dataPagamento;
    private LocalDateTime criadoEm;
}
