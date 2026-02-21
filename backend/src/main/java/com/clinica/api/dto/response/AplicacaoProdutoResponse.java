package com.clinica.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class AplicacaoProdutoResponse {
    private Long id;
    private Long pacienteId;
    private String pacienteNome;
    private Long loteId;
    private String numeroLote;
    private String produtoNome;
    private Integer quantidade;
    private LocalDate dataAplicacao;
    private LocalDate dataProximaAplicacao;
    private String observacoes;
    private LocalDateTime criadoEm;
}
