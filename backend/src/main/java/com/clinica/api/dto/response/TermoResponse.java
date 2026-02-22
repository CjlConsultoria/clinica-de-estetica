package com.clinica.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TermoResponse {
    private Long id;
    private String titulo;
    private String conteudo;
    private String versao;
    private boolean ativo;
    private LocalDateTime criadoEm;
}
