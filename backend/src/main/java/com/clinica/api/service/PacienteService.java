package com.clinica.api.service;

import com.clinica.api.dto.request.PacienteRequest;
import com.clinica.api.dto.response.PageResponse;
import com.clinica.api.dto.response.PacienteResponse;
import com.clinica.api.entity.Paciente;
import com.clinica.api.entity.Usuario;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ExceptionMessages;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    private Long getEmpresaId() {
        Usuario u = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return u.getEmpresaId();
    }

    public PageResponse<PacienteResponse> listar(String busca, Pageable pageable) {
        Long empresaId = getEmpresaId();
        Page<Paciente> page;
        if (empresaId != null) {
            if (busca != null && !busca.isBlank()) {
                page = pacienteRepository.buscarPorTermoAtivosEEmpresa(busca, empresaId, pageable);
            } else {
                page = pacienteRepository.findByEmpresaIdAndAtivoTrue(empresaId, pageable);
            }
        } else {
            if (busca != null && !busca.isBlank()) {
                page = pacienteRepository.buscarPorTermoAtivos(busca, pageable);
            } else {
                page = pacienteRepository.findByAtivoTrue(pageable);
            }
        }
        return PageResponse.of(page.map(this::toResponse));
    }

    public PacienteResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public PacienteResponse criar(PacienteRequest request) {
        if (pacienteRepository.existsByCpf(request.getCpf())) {
            throw new BusinessException(ExceptionMessages.CPF_JA_CADASTRADO);
        }
        if (request.getEmail() != null && !request.getEmail().isBlank() &&
                pacienteRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ExceptionMessages.EMAIL_JA_CADASTRADO);
        }

        Paciente paciente = toEntity(request);
        return toResponse(pacienteRepository.save(paciente));
    }

    @Transactional
    public PacienteResponse atualizar(Long id, PacienteRequest request) {
        Paciente paciente = findById(id);

        if (!paciente.getCpf().equals(request.getCpf()) &&
                pacienteRepository.existsByCpf(request.getCpf())) {
            throw new BusinessException(ExceptionMessages.CPF_JA_CADASTRADO);
        }

        atualizarEntidade(paciente, request);
        return toResponse(pacienteRepository.save(paciente));
    }

    @Transactional
    public void inativar(Long id) {
        Paciente paciente = findById(id);
        paciente.setAtivo(false);
        pacienteRepository.save(paciente);
    }

    private Paciente findById(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", id));
    }

    private Paciente toEntity(PacienteRequest request) {
        return Paciente.builder()
                .nome(request.getNome())
                .cpf(request.getCpf())
                .dataNascimento(request.getDataNascimento())
                .sexo(request.getSexo())
                .telefone(request.getTelefone())
                .celular(request.getCelular())
                .email(request.getEmail())
                .cep(request.getCep())
                .logradouro(request.getLogradouro())
                .numero(request.getNumero())
                .complemento(request.getComplemento())
                .bairro(request.getBairro())
                .cidade(request.getCidade())
                .estado(request.getEstado())
                .convenio(request.getConvenio())
                .numeroCarteirinha(request.getNumeroCarteirinha())
                .observacoes(request.getObservacoes())
                .empresaId(getEmpresaId())
                .ativo(true)
                .build();
    }

    private void atualizarEntidade(Paciente paciente, PacienteRequest request) {
        paciente.setNome(request.getNome());
        paciente.setCpf(request.getCpf());
        paciente.setDataNascimento(request.getDataNascimento());
        paciente.setSexo(request.getSexo());
        paciente.setTelefone(request.getTelefone());
        paciente.setCelular(request.getCelular());
        paciente.setEmail(request.getEmail());
        paciente.setCep(request.getCep());
        paciente.setLogradouro(request.getLogradouro());
        paciente.setNumero(request.getNumero());
        paciente.setComplemento(request.getComplemento());
        paciente.setBairro(request.getBairro());
        paciente.setCidade(request.getCidade());
        paciente.setEstado(request.getEstado());
        paciente.setConvenio(request.getConvenio());
        paciente.setNumeroCarteirinha(request.getNumeroCarteirinha());
        paciente.setObservacoes(request.getObservacoes());
    }

    private PacienteResponse toResponse(Paciente paciente) {
        return PacienteResponse.builder()
                .id(paciente.getId())
                .nome(paciente.getNome())
                .cpf(paciente.getCpf())
                .dataNascimento(paciente.getDataNascimento())
                .sexo(paciente.getSexo())
                .telefone(paciente.getTelefone())
                .celular(paciente.getCelular())
                .email(paciente.getEmail())
                .cep(paciente.getCep())
                .logradouro(paciente.getLogradouro())
                .numero(paciente.getNumero())
                .complemento(paciente.getComplemento())
                .bairro(paciente.getBairro())
                .cidade(paciente.getCidade())
                .estado(paciente.getEstado())
                .convenio(paciente.getConvenio())
                .numeroCarteirinha(paciente.getNumeroCarteirinha())
                .observacoes(paciente.getObservacoes())
                .ativo(paciente.isAtivo())
                .criadoEm(paciente.getCriadoEm())
                .build();
    }
}
