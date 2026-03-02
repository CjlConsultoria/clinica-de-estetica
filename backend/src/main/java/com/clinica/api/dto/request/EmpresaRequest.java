package com.clinica.api.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class EmpresaRequest {
    private String nome;
    private String email;
    private String telefone;
    private String cnpj;
    private String responsavel;
    private String plano;
    private BigDecimal valor;
    private String status;
    private String observacoes;
    private String adminNome;
    private String adminEmail;
}
