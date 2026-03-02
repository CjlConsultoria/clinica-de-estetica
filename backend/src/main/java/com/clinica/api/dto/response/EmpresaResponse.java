package com.clinica.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaResponse {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String cnpj;
    private String responsavel;
    private String plano;
    private BigDecimal valor;
    private String status;
    private LocalDate dataInicio;
    private LocalDate vencimento;
    private LocalDate proximaCobranca;
    private Integer usuarios;
    private String observacoes;
    private String adminNome;
    private String adminEmail;
    private Boolean ativo;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;
}
