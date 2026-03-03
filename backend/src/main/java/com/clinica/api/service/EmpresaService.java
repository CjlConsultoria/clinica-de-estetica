package com.clinica.api.service;

import com.clinica.api.dto.request.EmpresaRequest;
import com.clinica.api.dto.response.EmpresaResponse;
import com.clinica.api.entity.Empresa;
import com.clinica.api.entity.Usuario;
import com.clinica.api.enums.Role;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.EmpresaRepository;
import com.clinica.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

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

    @Transactional
    public EmpresaResponse criar(EmpresaRequest request) {
        if (request.getAdminEmail() != null && usuarioRepository.existsByEmail(request.getAdminEmail())) {
            throw new BusinessException("E-mail do administrador já está em uso");
        }

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

        Empresa saved = empresaRepository.save(empresa);

        if (request.getAdminNome() != null && request.getAdminEmail() != null
                && request.getAdminSenha() != null && !request.getAdminSenha().isBlank()) {
            Usuario adminUsuario = Usuario.builder()
                    .nome(request.getAdminNome())
                    .email(request.getAdminEmail())
                    .senha(passwordEncoder.encode(request.getAdminSenha()))
                    .role(Role.GERENTE)
                    .empresaId(saved.getId())
                    .ativo(true)
                    .build();
            usuarioRepository.save(adminUsuario);
        }

        return toResponse(saved);
    }

    @Transactional
    public EmpresaResponse atualizar(Long id, EmpresaRequest request) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));

        String oldAdminEmail = empresa.getAdminEmail();

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

        Empresa saved = empresaRepository.save(empresa);

        if (request.getAdminEmail() != null || request.getAdminNome() != null) {
            Optional<Usuario> adminOpt = oldAdminEmail != null
                    ? usuarioRepository.findByEmail(oldAdminEmail)
                    : Optional.empty();

            if (adminOpt.isPresent()) {
                Usuario admin = adminOpt.get();
                if (request.getAdminNome() != null) admin.setNome(request.getAdminNome());
                if (request.getAdminEmail() != null) admin.setEmail(request.getAdminEmail());
                if (request.getAdminSenha() != null && !request.getAdminSenha().isBlank()) {
                    admin.setSenha(passwordEncoder.encode(request.getAdminSenha()));
                }
                usuarioRepository.save(admin);
            } else if (request.getAdminNome() != null && request.getAdminEmail() != null
                    && request.getAdminSenha() != null && !request.getAdminSenha().isBlank()
                    && !usuarioRepository.existsByEmail(request.getAdminEmail())) {
                Usuario newAdmin = Usuario.builder()
                        .nome(request.getAdminNome())
                        .email(request.getAdminEmail())
                        .senha(passwordEncoder.encode(request.getAdminSenha()))
                        .role(Role.GERENTE)
                        .empresaId(saved.getId())
                        .ativo(true)
                        .build();
                usuarioRepository.save(newAdmin);
            }
        }

        return toResponse(saved);
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
