package com.clinica.api.service;

import com.clinica.api.dto.request.ProntuarioRequest;
import com.clinica.api.dto.response.PageResponse;
import com.clinica.api.dto.response.ProntuarioResponse;
import com.clinica.api.entity.Agendamento;
import com.clinica.api.entity.Paciente;
import com.clinica.api.entity.Prontuario;
import com.clinica.api.entity.Usuario;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.AgendamentoRepository;
import com.clinica.api.repository.PacienteRepository;
import com.clinica.api.repository.ProntuarioRepository;
import com.clinica.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final AgendamentoRepository agendamentoRepository;

    public PageResponse<ProntuarioResponse> listarPorPaciente(Long pacienteId, Pageable pageable) {
        return PageResponse.of(
                prontuarioRepository.findByPacienteId(pacienteId, pageable).map(this::toResponse)
        );
    }

    public ProntuarioResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public ProntuarioResponse criar(ProntuarioRequest request) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", request.getPacienteId()));

        Usuario medico = usuarioRepository.findById(request.getMedicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Médico", request.getMedicoId()));

        Agendamento agendamento = null;
        if (request.getAgendamentoId() != null) {
            agendamento = agendamentoRepository.findById(request.getAgendamentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agendamento", request.getAgendamentoId()));
        }

        Prontuario prontuario = Prontuario.builder()
                .paciente(paciente)
                .medico(medico)
                .agendamento(agendamento)
                .anamnese(request.getAnamnese())
                .exameFisico(request.getExameFisico())
                .diagnostico(request.getDiagnostico())
                .cid10(request.getCid10())
                .prescricao(request.getPrescricao())
                .examesSolicitados(request.getExamesSolicitados())
                .observacoes(request.getObservacoes())
                .build();

        return toResponse(prontuarioRepository.save(prontuario));
    }

    @Transactional
    public ProntuarioResponse atualizar(Long id, ProntuarioRequest request) {
        Prontuario prontuario = findById(id);

        prontuario.setAnamnese(request.getAnamnese());
        prontuario.setExameFisico(request.getExameFisico());
        prontuario.setDiagnostico(request.getDiagnostico());
        prontuario.setCid10(request.getCid10());
        prontuario.setPrescricao(request.getPrescricao());
        prontuario.setExamesSolicitados(request.getExamesSolicitados());
        prontuario.setObservacoes(request.getObservacoes());

        return toResponse(prontuarioRepository.save(prontuario));
    }

    private Prontuario findById(Long id) {
        return prontuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prontuário", id));
    }

    private ProntuarioResponse toResponse(Prontuario prontuario) {
        return ProntuarioResponse.builder()
                .id(prontuario.getId())
                .pacienteId(prontuario.getPaciente().getId())
                .pacienteNome(prontuario.getPaciente().getNome())
                .medicoId(prontuario.getMedico().getId())
                .medicoNome(prontuario.getMedico().getNome())
                .agendamentoId(prontuario.getAgendamento() != null ? prontuario.getAgendamento().getId() : null)
                .anamnese(prontuario.getAnamnese())
                .exameFisico(prontuario.getExameFisico())
                .diagnostico(prontuario.getDiagnostico())
                .cid10(prontuario.getCid10())
                .prescricao(prontuario.getPrescricao())
                .examesSolicitados(prontuario.getExamesSolicitados())
                .observacoes(prontuario.getObservacoes())
                .criadoEm(prontuario.getCriadoEm())
                .atualizadoEm(prontuario.getAtualizadoEm())
                .build();
    }
}
