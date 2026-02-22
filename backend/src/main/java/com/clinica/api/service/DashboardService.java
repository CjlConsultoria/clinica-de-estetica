package com.clinica.api.service;

import com.clinica.api.dto.response.DashboardResponse;
import com.clinica.api.enums.Role;
import com.clinica.api.enums.StatusAgendamento;
import com.clinica.api.enums.StatusPagamento;
import com.clinica.api.repository.AgendamentoRepository;
import com.clinica.api.repository.LancamentoRepository;
import com.clinica.api.repository.PacienteRepository;
import com.clinica.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PacienteRepository pacienteRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final LancamentoRepository lancamentoRepository;
    private final UsuarioRepository usuarioRepository;

    public DashboardResponse obterDashboard() {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicioDia = hoje.atStartOfDay();
        LocalDateTime fimDia = hoje.atTime(23, 59, 59);

        LocalDate inicioMes = hoje.withDayOfMonth(1);
        LocalDate fimMes = hoje.withDayOfMonth(hoje.lengthOfMonth());

        long totalPacientes = pacienteRepository.count();
        long agendamentosHoje = agendamentoRepository.countByDataHoraBetween(inicioDia, fimDia);
        long agendamentosMes = agendamentoRepository.countByDataHoraBetween(
                inicioMes.atStartOfDay(), fimMes.atTime(23, 59, 59)
        );
        long agendamentosAgendados = agendamentoRepository.countByStatus(StatusAgendamento.AGENDADO);
        long agendamentosCancelados = agendamentoRepository.countByStatus(StatusAgendamento.CANCELADO);

        BigDecimal receitaMes = lancamentoRepository.somarReceitasPorPeriodo(inicioMes, fimMes);
        BigDecimal receitaPendente = lancamentoRepository.somarPendentes();

        long totalMedicos = usuarioRepository.findByRole(Role.MEDICO).size();

        return DashboardResponse.builder()
                .totalPacientes(totalPacientes)
                .agendamentosHoje(agendamentosHoje)
                .agendamentosMes(agendamentosMes)
                .agendamentosAgendados(agendamentosAgendados)
                .agendamentosCancelados(agendamentosCancelados)
                .receitaMes(receitaMes)
                .receitaPendente(receitaPendente)
                .totalMedicos(totalMedicos)
                .build();
    }
}
