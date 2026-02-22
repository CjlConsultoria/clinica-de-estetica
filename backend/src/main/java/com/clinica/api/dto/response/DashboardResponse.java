package com.clinica.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private long totalPacientes;
    private long agendamentosHoje;
    private long agendamentosMes;
    private long agendamentosAgendados;
    private long agendamentosCancelados;
    private BigDecimal receitaMes;
    private BigDecimal receitaPendente;
    private long totalMedicos;
}
