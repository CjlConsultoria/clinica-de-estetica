package com.clinica.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComunicadoResponse {
    private Long id;
    private String titulo;
    private String conteudo;
    private String tipo;
    private Boolean ativo;
    private Long criadoPor;
    private String nomeAutor;
    private String status;
    private String destinatariosJson;
    private LocalDateTime dataAgendamento;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
