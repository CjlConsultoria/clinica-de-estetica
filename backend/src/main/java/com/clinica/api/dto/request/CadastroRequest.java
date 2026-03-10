package com.clinica.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CadastroRequest {

    @NotBlank(message = "Nome da empresa é obrigatório")
    private String nomeEmpresa;

    @NotBlank(message = "CNPJ é obrigatório")
    private String cnpj;

    private String telefoneEmpresa;

    @NotBlank(message = "Nome do responsável é obrigatório")
    private String nomeResponsavel;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    private String telefoneResponsavel;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter pelo menos 8 caracteres")
    private String senha;

    @NotBlank(message = "Plano é obrigatório")
    private String plano;
}
