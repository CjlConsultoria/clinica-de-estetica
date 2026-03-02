package com.clinica.api.service;

import com.clinica.api.dto.request.ComissaoConfigRequest;
import com.clinica.api.dto.response.ComissaoResponse;
import com.clinica.api.dto.response.ComissaoResumoResponse;
import com.clinica.api.entity.Agendamento;
import com.clinica.api.entity.Comissao;
import com.clinica.api.entity.ComissaoConfig;
import com.clinica.api.entity.Lancamento;
import com.clinica.api.entity.Usuario;
import com.clinica.api.enums.StatusComissao;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ExceptionMessages;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.ComissaoConfigRepository;
import com.clinica.api.repository.ComissaoRepository;
import com.clinica.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComissaoService {

    private final ComissaoRepository comissaoRepository;
    private final ComissaoConfigRepository configRepository;
    private final UsuarioRepository usuarioRepository;

    private Long getEmpresaId() {
        Usuario u = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return u.getEmpresaId();
    }

    public List<ComissaoResponse> listarTodas() {
        Long empresaId = getEmpresaId();
        if (empresaId != null) {
            return comissaoRepository.findByUsuario_EmpresaId(empresaId)
                    .stream()
                    .sorted((a, b) -> b.getCriadoEm().compareTo(a.getCriadoEm()))
                    .map(this::toResponse)
                    .toList();
        }
        return comissaoRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCriadoEm().compareTo(a.getCriadoEm()))
                .map(this::toResponse)
                .toList();
    }

    public List<ComissaoResponse> listarPorMedico(Long usuarioId) {
        return comissaoRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId)
                .stream().map(this::toResponse).toList();
    }

    public List<ComissaoResponse> listarPorMedicoEPeriodo(Long usuarioId, LocalDate inicio, LocalDate fim) {
        return comissaoRepository.findByUsuarioIdEPeriodo(usuarioId, inicio, fim)
                .stream().map(this::toResponse).toList();
    }

    public ComissaoResumoResponse resumoPorMedico(Long usuarioId) {
        Usuario usuario = findUsuario(usuarioId);
        Optional<ComissaoConfig> config = configRepository.findByUsuarioId(usuarioId);
        BigDecimal pendente = comissaoRepository.somarPendentesPorUsuario(usuarioId);
        long quantidade = comissaoRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId)
                .stream().filter(c -> c.getStatus() == StatusComissao.PENDENTE).count();

        return ComissaoResumoResponse.builder()
                .usuarioId(usuarioId)
                .usuarioNome(usuario.getNome())
                .percentualPadrao(config.map(ComissaoConfig::getPercentualPadrao).orElse(BigDecimal.ZERO))
                .totalPendente(pendente)
                .quantidadePendente(quantidade)
                .build();
    }

    @Transactional
    public ComissaoResponse pagar(Long comissaoId) {
        Comissao comissao = comissaoRepository.findById(comissaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Comissão", comissaoId));

        if (comissao.getStatus() != StatusComissao.PENDENTE) {
            throw new BusinessException(String.format(ExceptionMessages.COMISSAO_NAO_PENDENTE, comissao.getStatus()));
        }

        comissao.setStatus(StatusComissao.PAGO);
        comissao.setDataPagamento(LocalDate.now());
        return toResponse(comissaoRepository.save(comissao));
    }

    @Transactional
    public ComissaoConfig salvarConfig(ComissaoConfigRequest request) {
        Usuario usuario = findUsuario(request.getUsuarioId());
        ComissaoConfig config = configRepository.findByUsuarioId(usuario.getId())
                .orElse(ComissaoConfig.builder().usuario(usuario).build());
        config.setPercentualPadrao(request.getPercentualPadrao());
        config.setAtivo(true);
        return configRepository.save(config);
    }

    public Optional<ComissaoConfig> buscarConfig(Long usuarioId) {
        return configRepository.findByUsuarioId(usuarioId);
    }

    @Transactional
    public void calcularERegistrarComissao(Lancamento lancamento) {
        if (lancamento.getAgendamento() == null) return;
        if (comissaoRepository.existsByLancamentoId(lancamento.getId())) return;

        Usuario medico = lancamento.getAgendamento().getMedico();
        Optional<ComissaoConfig> config = configRepository.findByUsuarioId(medico.getId());

        if (config.isEmpty() || !config.get().isAtivo()) {
            log.debug("Sem configuração de comissão para médico {}", medico.getId());
            return;
        }

        BigDecimal percentual = config.get().getPercentualPadrao();
        BigDecimal desconto = lancamento.getValorDesconto() != null ? lancamento.getValorDesconto() : BigDecimal.ZERO;
        BigDecimal valorBase = lancamento.getValor().subtract(desconto);
        BigDecimal valorComissao = valorBase.multiply(percentual)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        Comissao comissao = Comissao.builder()
                .usuario(medico)
                .lancamento(lancamento)
                .agendamento(lancamento.getAgendamento())
                .valorBase(valorBase)
                .percentual(percentual)
                .valorComissao(valorComissao)
                .status(StatusComissao.PENDENTE)
                .build();

        comissaoRepository.save(comissao);
        log.info("Comissão de {} calculada para médico {}: R$ {}",
                percentual + "%", medico.getNome(), valorComissao);
    }

    private Usuario findUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
    }

    private ComissaoResponse toResponse(Comissao c) {
        Agendamento ag = c.getAgendamento();
        return ComissaoResponse.builder()
                .id(c.getId())
                .usuarioId(c.getUsuario().getId())
                .usuarioNome(c.getUsuario().getNome())
                .lancamentoId(c.getLancamento().getId())
                .agendamentoId(ag != null ? ag.getId() : null)
                .procedimento(ag != null ? ag.getTipoConsulta() : null)
                .pacienteNome(ag != null ? ag.getPaciente().getNome() : null)
                .valorBase(c.getValorBase())
                .percentual(c.getPercentual())
                .valorComissao(c.getValorComissao())
                .status(c.getStatus())
                .dataPagamento(c.getDataPagamento())
                .criadoEm(c.getCriadoEm())
                .build();
    }
}
