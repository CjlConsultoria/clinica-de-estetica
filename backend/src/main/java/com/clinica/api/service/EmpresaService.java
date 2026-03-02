package com.clinica.api.service;

import com.clinica.api.dto.request.EmpresaRequest;
import com.clinica.api.dto.response.EmpresaResponse;
import com.clinica.api.entity.Empresa;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public List<EmpresaResponse> listar() {
        return empresaRepository.findAllByOrderByCriadoEmDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EmpresaResponse buscarPorId(Long id) {
        return toResponse(empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada")));
    }

    public EmpresaResponse criar(EmpresaRequest request) {
        Empresa empresa = Empresa.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .telefone(request.getTelefone())
                .cnpj(request.getCnpj())
                .responsavel(request.getResponsavel())
                .plano(request.getPlano())
                .valor(request.getValor() != null ? request.getValor() : BigDecimal.ZERO)
                .status(request.getStatus() != null ? request.getStatus() : "ativo")
                .observacoes(request.getObservacoes())
                .adminNome(request.getAdminNome())
                .adminEmail(request.getAdminEmail())
                .dataInicio(LocalDate.now())
                .vencimento(LocalDate.now().plusDays(30))
                .proximaCobranca(LocalDate.now().plusDays(30))
                .usuarios(1)
                .ativo(true)
                .build();
        return toResponse(empresaRepository.save(empresa));
    }

    public EmpresaResponse atualizar(Long id, EmpresaRequest request) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));

        if (request.getNome() != null) empresa.setNome(request.getNome());
        if (request.getEmail() != null) empresa.setEmail(request.getEmail());
        if (request.getTelefone() != null) empresa.setTelefone(request.getTelefone());
        if (request.getCnpj() != null) empresa.setCnpj(request.getCnpj());
        if (request.getResponsavel() != null) empresa.setResponsavel(request.getResponsavel());
        if (request.getPlano() != null) empresa.setPlano(request.getPlano());
        if (request.getValor() != null) empresa.setValor(request.getValor());
        if (request.getStatus() != null) {
            empresa.setStatus(request.getStatus());
            empresa.setAtivo(!request.getStatus().equals("cancelado"));
        }
        if (request.getObservacoes() != null) empresa.setObservacoes(request.getObservacoes());
        if (request.getAdminNome() != null) empresa.setAdminNome(request.getAdminNome());
        if (request.getAdminEmail() != null) empresa.setAdminEmail(request.getAdminEmail());

        return toResponse(empresaRepository.save(empresa));
    }

    public EmpresaResponse atualizarStatus(Long id, String status) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));
        empresa.setStatus(status);
        empresa.setAtivo(!status.equals("cancelado") && !status.equals("suspenso"));
        return toResponse(empresaRepository.save(empresa));
    }

    private EmpresaResponse toResponse(Empresa e) {
        return EmpresaResponse.builder()
                .id(e.getId())
                .nome(e.getNome())
                .email(e.getEmail())
                .telefone(e.getTelefone())
                .cnpj(e.getCnpj())
                .responsavel(e.getResponsavel())
                .plano(e.getPlano())
                .valor(e.getValor())
                .status(e.getStatus())
                .dataInicio(e.getDataInicio())
                .vencimento(e.getVencimento())
                .proximaCobranca(e.getProximaCobranca())
                .usuarios(e.getUsuarios())
                .observacoes(e.getObservacoes())
                .adminNome(e.getAdminNome())
                .adminEmail(e.getAdminEmail())
                .ativo(e.getAtivo())
                .criadoEm(e.getCriadoEm())
                .atualizadoEm(e.getAtualizadoEm())
                .build();
    }
}
