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
public class NotificacaoResponse {
    private Long id;
    private String tipo;
    private String prioridade;
    private String titulo;
    private String descricao;
    private Long empresaId;
    private String empresaNome;
    private Boolean lida;
    private LocalDateTime criadoEm;
}
