package com.clinica.api.dto.response;

import com.clinica.api.enums.StatusLote;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class LoteResponse {
    private Long id;
    private Long produtoId;
    private String produtoNome;
    private String produtoCategoria;
    private String produtoUnidade;
    private String produtoFabricante;
    private String produtoRegistroAnvisa;
    private Integer produtoEstoqueMinimo;
    private Integer produtoEstoqueMaximo;
    private BigDecimal produtoPrecoUnitario;
    private String numeroLote;
    private LocalDate dataFabricacao;
    private LocalDate dataValidade;
    private Integer quantidadeTotal;
    private Integer quantidadeAtual;
    private String fornecedor;
    private String notaFiscal;
    private StatusLote status;
    private boolean ativo;
    private LocalDateTime criadoEm;
}
