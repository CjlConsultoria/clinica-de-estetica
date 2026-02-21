package com.clinica.api.dto.response;

import com.clinica.api.enums.TipoAlertaEstoque;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AlertaEstoqueResponse {
    private Long id;
    private Long loteId;
    private String numeroLote;
    private String produtoNome;
    private TipoAlertaEstoque tipo;
    private String mensagem;
    private LocalDateTime dataAlerta;
    private boolean lido;
}
