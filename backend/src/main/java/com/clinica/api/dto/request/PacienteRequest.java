package com.clinica.api.dto.request;

import com.clinica.api.enums.Sexo;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

@Data
public class PacienteRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    @CPF(message = "CPF inválido")
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
}
