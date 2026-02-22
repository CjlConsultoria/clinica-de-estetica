package com.clinica.api.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ComissaoConfigRequest {

    @NotNull(message = "Usuário é obrigatório")
    private Long usuarioId;

    @NotNull(message = "Percentual é obrigatório")
    @DecimalMin(value = "0.01", message = "Percentual deve ser maior que zero")
    @DecimalMax(value = "100.00", message = "Percentual não pode ser maior que 100")
    private BigDecimal percentualPadrao;
}
