package com.clinica.api.service;

import com.clinica.api.dto.request.AgendamentoRequest;
import com.clinica.api.dto.request.AgendamentoStatusRequest;
import com.clinica.api.dto.response.AgendamentoResponse;
import com.clinica.api.dto.response.PageResponse;
import com.clinica.api.entity.Agendamento;
import com.clinica.api.entity.Paciente;
import com.clinica.api.entity.Usuario;
import com.clinica.api.enums.StatusAgendamento;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ExceptionMessages;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.AgendamentoRepository;
import com.clinica.api.repository.PacienteRepository;
import com.clinica.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;

    public PageResponse<AgendamentoResponse> listar(Pageable pageable) {
        Page<Agendamento> page = agendamentoRepository.findAll(pageable);
        return PageResponse.of(page.map(this::toResponse));
    }

    public PageResponse<AgendamentoResponse> listarPorMedico(Long medicoId, Pageable pageable) {
        return PageResponse.of(agendamentoRepository.findByMedicoId(medicoId, pageable).map(this::toResponse));
    }

    public PageResponse<AgendamentoResponse> listarPorPaciente(Long pacienteId, Pageable pageable) {
        return PageResponse.of(agendamentoRepository.findByPacienteId(pacienteId, pageable).map(this::toResponse));
    }

    public List<AgendamentoResponse> listarPorMedicoEPeriodo(Long medicoId, LocalDateTime inicio, LocalDateTime fim) {
        return agendamentoRepository.findByMedicoIdAndPeriodo(medicoId, inicio, fim).stream()
                .map(this::toResponse)
                .toList();
    }

    public AgendamentoResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public AgendamentoResponse criar(AgendamentoRequest request) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", request.getPacienteId()));

        Usuario medico = usuarioRepository.findById(request.getMedicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Médico", request.getMedicoId()));

        verificarConflito(request.getMedicoId(), request.getDataHora(),
                request.getDuracaoMinutos(), null);

        Agendamento agendamento = Agendamento.builder()
                .paciente(paciente)
                .medico(medico)
                .dataHora(request.getDataHora())
                .duracaoMinutos(request.getDuracaoMinutos())
                .tipoConsulta(request.getTipoConsulta())
                .observacoes(request.getObservacoes())
                .status(StatusAgendamento.AGENDADO)
                .build();

        return toResponse(agendamentoRepository.save(agendamento));
    }

    @Transactional
    public AgendamentoResponse atualizarStatus(Long id, AgendamentoStatusRequest request) {
        Agendamento agendamento = findById(id);

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new BusinessException(ExceptionMessages.AGENDAMENTO_JA_CANCELADO);
        }

        agendamento.setStatus(request.getStatus());

        if (request.getStatus() == StatusAgendamento.CANCELADO) {
            agendamento.setMotivoCancelamento(request.getMotivoCancelamento());
        }

        return toResponse(agendamentoRepository.save(agendamento));
    }

    @Transactional
    public AgendamentoResponse atualizar(Long id, AgendamentoRequest request) {
        Agendamento agendamento = findById(id);

        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", request.getPacienteId()));

        Usuario medico = usuarioRepository.findById(request.getMedicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Médico", request.getMedicoId()));

        verificarConflito(request.getMedicoId(), request.getDataHora(),
                request.getDuracaoMinutos(), id);

        agendamento.setPaciente(paciente);
        agendamento.setMedico(medico);
        agendamento.setDataHora(request.getDataHora());
        agendamento.setDuracaoMinutos(request.getDuracaoMinutos());
        agendamento.setTipoConsulta(request.getTipoConsulta());
        agendamento.setObservacoes(request.getObservacoes());

        return toResponse(agendamentoRepository.save(agendamento));
    }

    private void verificarConflito(Long medicoId, LocalDateTime dataHora, Integer duracao, Long idIgnorar) {
        LocalDateTime fim = dataHora.plusMinutes(duracao != null ? duracao : 30);
        List<Agendamento> conflitos = agendamentoRepository.findConflitosAgenda(medicoId, dataHora, fim);

        if (idIgnorar != null) {
            conflitos = conflitos.stream().filter(a -> !a.getId().equals(idIgnorar)).toList();
        }

        if (!conflitos.isEmpty()) {
            throw new BusinessException(ExceptionMessages.MEDICO_HORARIO_OCUPADO);
        }
    }

    private Agendamento findById(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento", id));
    }

    private AgendamentoResponse toResponse(Agendamento agendamento) {
        return AgendamentoResponse.builder()
                .id(agendamento.getId())
                .pacienteId(agendamento.getPaciente().getId())
                .pacienteNome(agendamento.getPaciente().getNome())
                .medicoId(agendamento.getMedico().getId())
                .medicoNome(agendamento.getMedico().getNome())
                .dataHora(agendamento.getDataHora())
                .duracaoMinutos(agendamento.getDuracaoMinutos())
                .status(agendamento.getStatus())
                .tipoConsulta(agendamento.getTipoConsulta())
                .observacoes(agendamento.getObservacoes())
                .motivoCancelamento(agendamento.getMotivoCancelamento())
                .criadoEm(agendamento.getCriadoEm())
                .build();
    }
}
