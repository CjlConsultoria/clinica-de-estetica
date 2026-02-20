package com.clinica.api.dto.response;

import com.clinica.api.enums.Sexo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteResponse {

    private Long id;
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private Sexo sexo;
    private String telefone;
    private String celular;
    private String email;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    private String convenio;
    private String numeroCarteirinha;
    private String observacoes;
    private boolean ativo;
    private LocalDateTime criadoEm;
}
