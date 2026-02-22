package com.clinica.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedimentoResponse {

    private Long id;
    private String nome;
    private String codigo;
    private String categoria;
    private BigDecimal valor;
    private Integer duracaoMinutos;
    private BigDecimal percentualComissao;
    private String descricao;
    private boolean ativo;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
