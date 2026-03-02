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
public class SuporteTicketResponse {
    private Long id;
    private String titulo;
    private String descricao;
    private String categoria;
    private String status;
    private String prioridade;
    private Long criadoPor;
    private String nomeAutor;
    private Long empresaId;
    private String empresaNome;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
