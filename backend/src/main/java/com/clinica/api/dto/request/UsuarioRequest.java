package com.clinica.api.dto.request;

import com.clinica.api.enums.Cargo;
import com.clinica.api.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UsuarioRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    private String senha;


    private Role role;

    private Cargo cargo;

    private String telefone;

    private String especialidade;

    private String registro;

    private String observacoes;
}
