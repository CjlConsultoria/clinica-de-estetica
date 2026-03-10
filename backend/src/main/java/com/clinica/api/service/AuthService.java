package com.clinica.api.service;

import com.clinica.api.dto.request.CadastroRequest;
import com.clinica.api.dto.request.LoginRequest;
import com.clinica.api.dto.request.UsuarioRequest;
import com.clinica.api.dto.response.AuthResponse;
import com.clinica.api.entity.Empresa;
import com.clinica.api.entity.FaturaAssinatura;
import com.clinica.api.entity.Usuario;
import com.clinica.api.enums.Role;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ExceptionMessages;
import com.clinica.api.repository.EmpresaRepository;
import com.clinica.api.repository.FaturaAssinaturaRepository;
import com.clinica.api.repository.UsuarioRepository;
import com.clinica.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final EmpresaRepository empresaRepository;
    private final FaturaAssinaturaRepository faturaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        String token = jwtService.gerarToken(usuario);

        return AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuarioId(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .cargo(usuario.getCargo())
                .areaProfissional(usuario.getAreaProfissional())
                .empresaId(usuario.getEmpresaId())
                .build();
    }

    public AuthResponse registrar(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ExceptionMessages.EMAIL_JA_EM_USO);
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .role(request.getRole())
                .cargo(request.getCargo())
                .areaProfissional(request.getCargo() != null ? request.getCargo().getArea() : null)
                .telefone(request.getTelefone())
                .especialidade(request.getEspecialidade())
                .registro(request.getRegistro())
                .observacoes(request.getObservacoes())
                .ativo(true)
                .build();

        usuarioRepository.save(usuario);
        String token = jwtService.gerarToken(usuario);

        return AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuarioId(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .cargo(usuario.getCargo())
                .areaProfissional(usuario.getAreaProfissional())
                .empresaId(usuario.getEmpresaId())
                .build();
    }

    @Transactional
    public AuthResponse cadastrar(CadastroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ExceptionMessages.EMAIL_JA_EM_USO);
        }

        BigDecimal valor = switch (request.getPlano()) {
            case "Starter"    -> new BigDecimal("97.00");
            case "Enterprise" -> new BigDecimal("697.00");
            default           -> new BigDecimal("297.00");
        };

        Empresa empresa = Empresa.builder()
                .nome(request.getNomeEmpresa())
                .email(request.getEmail())
                .telefone(request.getTelefoneEmpresa())
                .cnpj(request.getCnpj())
                .responsavel(request.getNomeResponsavel())
                .plano(request.getPlano())
                .valor(valor)
                .status("trial")
                .adminNome(request.getNomeResponsavel())
                .adminEmail(request.getEmail())
                .dataInicio(LocalDate.now())
                .vencimento(LocalDate.now().plusDays(5))
                .proximaCobranca(LocalDate.now().plusDays(5))
                .usuarios(1)
                .ativo(true)
                .build();

        Empresa savedEmpresa = empresaRepository.save(empresa);

        Usuario usuario = Usuario.builder()
                .nome(request.getNomeResponsavel())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .role(Role.GERENTE)
                .telefone(request.getTelefoneResponsavel())
                .empresaId(savedEmpresa.getId())
                .ativo(true)
                .build();

        usuarioRepository.save(usuario);

        String mes = LocalDate.now().getMonth()
                .getDisplayName(TextStyle.FULL, new Locale("pt", "BR"));
        mes = mes.substring(0, 1).toUpperCase() + mes.substring(1);
        String competencia = mes + " " + LocalDate.now().getYear();

        FaturaAssinatura fatura = FaturaAssinatura.builder()
                .empresa(savedEmpresa)
                .competencia(competencia)
                .valor(valor)
                .plano(request.getPlano())
                .vencimento(LocalDate.now().plusDays(5))
                .status("pendente")
                .observacoes("Período de trial - 5 dias gratuitos")
                .build();

        faturaRepository.save(fatura);

        String token = jwtService.gerarToken(usuario);

        return AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuarioId(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .cargo(usuario.getCargo())
                .areaProfissional(usuario.getAreaProfissional())
                .empresaId(usuario.getEmpresaId())
                .build();
    }
}
