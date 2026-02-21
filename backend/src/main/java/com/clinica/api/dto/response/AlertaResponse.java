package com.clinica.api.dto.response;

import com.clinica.api.enums.StatusAlerta;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class AlertaResponse {
    private Long id;
    private Long pacienteId;
    private String pacienteNome;
    private Long aplicacaoId;
    private String produtoNome;
    private LocalDate dataAlerta;
    private String mensagem;
    private StatusAlerta status;
    private boolean lido;
    private LocalDateTime criadoEm;
}
