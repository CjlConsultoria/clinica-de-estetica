package com.clinica.api.service;

import com.clinica.api.dto.response.DashboardResponse;
import com.clinica.api.entity.Usuario;
import com.clinica.api.enums.Role;
import com.clinica.api.enums.StatusAgendamento;
import com.clinica.api.repository.AgendamentoRepository;
import com.clinica.api.repository.LancamentoRepository;
import com.clinica.api.repository.PacienteRepository;
import com.clinica.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
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

    private Long getEmpresaId() {
        Usuario u = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return u.getEmpresaId();
    }

    public DashboardResponse obterDashboard() {
        Long empresaId = getEmpresaId();

        LocalDate hoje = LocalDate.now();
        LocalDateTime inicioDia = hoje.atStartOfDay();
        LocalDateTime fimDia = hoje.atTime(23, 59, 59);

        LocalDate inicioMes = hoje.withDayOfMonth(1);
        LocalDate fimMes = hoje.withDayOfMonth(hoje.lengthOfMonth());

        long totalPacientes = (empresaId != null)
                ? pacienteRepository.countByEmpresaIdAndAtivoTrue(empresaId)
                : pacienteRepository.countByAtivoTrue();

        long agendamentosHoje = (empresaId != null)
                ? agendamentoRepository.countByEmpresaIdAndDataHoraBetween(empresaId, inicioDia, fimDia)
                : agendamentoRepository.countByDataHoraBetween(inicioDia, fimDia);

        long agendamentosMes = (empresaId != null)
                ? agendamentoRepository.countByEmpresaIdAndDataHoraBetween(empresaId, inicioMes.atStartOfDay(), fimMes.atTime(23, 59, 59))
                : agendamentoRepository.countByDataHoraBetween(inicioMes.atStartOfDay(), fimMes.atTime(23, 59, 59));

        long agendamentosAgendados = (empresaId != null)
                ? agendamentoRepository.countByEmpresaIdAndStatus(empresaId, StatusAgendamento.AGENDADO)
                : agendamentoRepository.countByStatus(StatusAgendamento.AGENDADO);

        long agendamentosCancelados = (empresaId != null)
                ? agendamentoRepository.countByEmpresaIdAndStatus(empresaId, StatusAgendamento.CANCELADO)
                : agendamentoRepository.countByStatus(StatusAgendamento.CANCELADO);

        BigDecimal receitaMes = (empresaId != null)
                ? lancamentoRepository.somarReceitasPorPeriodoEEmpresa(empresaId, inicioMes, fimMes)
                : lancamentoRepository.somarReceitasPorPeriodo(inicioMes, fimMes);

        BigDecimal receitaPendente = (empresaId != null)
                ? lancamentoRepository.somarPendentesEEmpresa(empresaId)
                : lancamentoRepository.somarPendentes();

        long totalMedicos = (empresaId != null)
                ? usuarioRepository.findByEmpresaIdAndRoleAndAtivoTrue(empresaId, Role.TECNICO).size()
                : usuarioRepository.findByRole(Role.TECNICO).size();

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
