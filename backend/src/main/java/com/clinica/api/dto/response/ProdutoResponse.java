package com.clinica.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProdutoResponse {
    private Long id;
    private String nome;
    private String fabricante;
    private String registroAnvisa;
    private String descricao;
    private boolean ativo;
    private int totalLotes;
    private int estoqueTotal;
    private LocalDateTime criadoEm;
}
