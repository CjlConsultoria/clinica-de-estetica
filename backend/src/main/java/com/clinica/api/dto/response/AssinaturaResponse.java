package com.clinica.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AssinaturaResponse {
    private Long id;
    private Long pacienteId;
    private String pacienteNome;
    private Long termoId;
    private String termoTitulo;
    private String termoVersao;
    private String hashAssinatura;
    private String ipOrigem;
    private LocalDateTime dataAssinatura;
    private LocalDateTime criadoEm;
}
