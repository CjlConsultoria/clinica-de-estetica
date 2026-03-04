package com.clinica.api.service;

import com.clinica.api.dto.request.UsuarioRequest;
import com.clinica.api.dto.response.UsuarioResponse;
import com.clinica.api.entity.Usuario;
import com.clinica.api.enums.AreaProfissional;
import com.clinica.api.enums.Cargo;
import com.clinica.api.enums.Role;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ExceptionMessages;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.AgendamentoRepository;
import com.clinica.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AgendamentoRepository agendamentoRepository;

    private Long getEmpresaId() {
        try {
            Usuario u = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return u.getEmpresaId();
        } catch (Exception e) {
            return null;
        }
    }

    public List<UsuarioResponse> listarTodos() {
        Long empresaId = getEmpresaId();
        if (empresaId != null) {
            return usuarioRepository.findByEmpresaIdAndCargoNotNullAndAtivoTrue(empresaId).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getCargo() != null && u.isAtivo())
                .map(this::toResponse)
                .toList();
    }

    public List<UsuarioResponse> listarMedicos() {
        Long empresaId = getEmpresaId();
        if (empresaId != null) {
            return usuarioRepository.findByEmpresaIdAndCargoAndAtivoTrue(empresaId, Cargo.MEDICO).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return usuarioRepository.findByCargoAndAtivoTrue(Cargo.MEDICO).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<UsuarioResponse> listarAreaTecnica() {
        Long empresaId = getEmpresaId();
        if (empresaId != null) {
            return usuarioRepository.findByEmpresaIdAndAreaProfissionalAndAtivoTrue(empresaId, AreaProfissional.TECNICA).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return usuarioRepository.findByAreaProfissionalAndAtivoTrue(AreaProfissional.TECNICA).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<UsuarioResponse> listarAreaAdministrativa() {
        Long empresaId = getEmpresaId();
        if (empresaId != null) {
            return usuarioRepository.findByEmpresaIdAndAreaProfissionalAndAtivoTrue(empresaId, AreaProfissional.ADMINISTRATIVA).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return usuarioRepository.findByAreaProfissionalAndAtivoTrue(AreaProfissional.ADMINISTRATIVA).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<UsuarioResponse> listarPorCargo(Cargo cargo) {
        Long empresaId = getEmpresaId();
        if (empresaId != null) {
            return usuarioRepository.findByEmpresaIdAndCargoAndAtivoTrue(empresaId, cargo).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return usuarioRepository.findByCargoAndAtivoTrue(cargo).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<UsuarioResponse> listarPorArea(AreaProfissional area) {
        Long empresaId = getEmpresaId();
        if (empresaId != null) {
            return usuarioRepository.findByEmpresaIdAndAreaProfissionalAndAtivoTrue(empresaId, area).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return usuarioRepository.findByAreaProfissionalAndAtivoTrue(area).stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public UsuarioResponse criar(UsuarioRequest request) {
        if (request.getSenha() == null || request.getSenha().isBlank()) {
            throw new BusinessException(ExceptionMessages.SENHA_OBRIGATORIA);
        }
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ExceptionMessages.EMAIL_JA_EM_USO);
        }

        Role role = resolverRole(request);
        AreaProfissional area = request.getCargo() != null ? request.getCargo().getArea() : null;
        Long empresaId = getEmpresaId() != null
                ? getEmpresaId()
                : request.getEmpresaId();

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .role(role)
                .cargo(request.getCargo())
                .areaProfissional(area)
                .telefone(request.getTelefone())
                .especialidade(request.getEspecialidade())
                .registro(request.getRegistro())
                .observacoes(request.getObservacoes())
                .empresaId(empresaId)
                .build();

        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioRequest request) {
        Usuario usuario = findById(id);

        if (!usuario.getEmail().equals(request.getEmail()) &&
                usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ExceptionMessages.EMAIL_JA_EM_USO);
        }

        Role role = resolverRole(request);
        AreaProfissional area = request.getCargo() != null ? request.getCargo().getArea() : null;

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setRole(role);
        usuario.setCargo(request.getCargo());
        usuario.setAreaProfissional(area);
        usuario.setTelefone(request.getTelefone());
        usuario.setEspecialidade(request.getEspecialidade());
        usuario.setRegistro(request.getRegistro());
        usuario.setObservacoes(request.getObservacoes());

        if (request.getSenha() != null && !request.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        }

        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void deletar(Long id) {
        findById(id);
        usuarioRepository.deleteById(id);
    }

    @Transactional
    public void inativar(Long id) {
        Usuario usuario = findById(id);
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void ativar(Long id) {
        Usuario usuario = findById(id);
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
    }


    private Role resolverRole(UsuarioRequest request) {
        if (request.getRole() != null) {
            return request.getRole();
        }
        if (request.getCargo() != null) {
            return switch (request.getCargo()) {
                case GERENTE    -> Role.GERENTE;
                case FINANCEIRO -> Role.FINANCEIRO;
                case RECEPCIONISTA -> Role.RECEPCIONISTA;
                default         -> Role.TECNICO;
            };
        }
        throw new BusinessException(ExceptionMessages.CARGO_OU_ROLE_OBRIGATORIO);
    }

    private Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        Cargo cargo = usuario.getCargo();
        AreaProfissional area = usuario.getAreaProfissional();
        long atendimentos = usuario.getId() != null
                ? agendamentoRepository.countByMedicoId(usuario.getId())
                : 0L;

        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .cargo(cargo)
                .cargoDescricao(cargo != null ? cargo.getDescricao() : null)
                .areaProfissional(area)
                .areaDescricao(area != null ? area.getDescricao() : null)
                .telefone(usuario.getTelefone())
                .especialidade(usuario.getEspecialidade())
                .registro(usuario.getRegistro())
                .observacoes(usuario.getObservacoes())
                .atendimentos(atendimentos)
                .ativo(usuario.isAtivo())
                .criadoEm(usuario.getCriadoEm())
                .build();
    }
}
