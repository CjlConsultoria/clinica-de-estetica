package com.clinica.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ComunicadoRequest {
    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    @NotBlank(message = "Conteúdo é obrigatório")
    private String conteudo;

    private String tipo = "info";
    private String status = "enviado"; // enviado, agendado, rascunho
    private String destinatariosJson = "todas";
    private LocalDateTime dataAgendamento;
}
