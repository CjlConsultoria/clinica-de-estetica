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
import com.clinica.api.enums.StatusPagamento;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ExceptionMessages;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.ComissaoConfigRepository;
import com.clinica.api.repository.ComissaoRepository;
import com.clinica.api.repository.LancamentoRepository;
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
    private final LancamentoRepository lancamentoRepository;

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
        if (lancamento.getAgendamento() == null) {
            log.debug("Lançamento {} sem agendamento vinculado — comissão ignorada.", lancamento.getId());
            return;
        }
        if (comissaoRepository.existsByLancamentoId(lancamento.getId())) {
            log.debug("Comissão já registrada para lançamento {}.", lancamento.getId());
            return;
        }
        Usuario medico = lancamento.getAgendamento().getMedico();
        if (medico == null) {
            log.warn("Agendamento {} sem profissional atribuído — comissão NÃO gerada para lançamento {}.",
                    lancamento.getAgendamento().getId(), lancamento.getId());
            return;
        }
        Optional<ComissaoConfig> config = configRepository.findByUsuarioId(medico.getId());

        if (config.isEmpty() || !config.get().isAtivo()) {
            log.warn("Profissional '{}' (id={}) sem configuração de comissão ativa — comissão NÃO gerada para lançamento {}. " +
                    "Configure o percentual em Profissionais.",
                    medico.getNome(), medico.getId(), lancamento.getId());
            return;
        }
        BigDecimal percentual = config.get().getPercentualPadrao();
        BigDecimal desconto = lancamento.getValorDesconto() != null ? lancamento.getValorDesconto() : BigDecimal.ZERO;
        BigDecimal valorBase = lancamento.getValor().subtract(desconto);
        if (valorBase.compareTo(BigDecimal.ZERO) < 0) {
            valorBase = BigDecimal.ZERO;
        }
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
                .empresaId(lancamento.getEmpresaId())
                .build();

        comissaoRepository.save(comissao);
        log.info("Comissão de {}% registrada para profissional '{}' (id={}): R$ {} — lançamento {}.",
                percentual, medico.getNome(), medico.getId(), valorComissao, lancamento.getId());
    }

    @Transactional
    public ComissaoResponse recalcularComissao(Long lancamentoId) {
        Lancamento lancamento = lancamentoRepository.findById(lancamentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Lançamento", lancamentoId));
        if (lancamento.getStatus() != StatusPagamento.PAGO) {
            throw new BusinessException(ExceptionMessages.LANCAMENTO_NAO_PAGO_RECALCULO);
        }

        Optional<Comissao> existente = comissaoRepository.findByLancamentoId(lancamentoId);
        if (existente.isPresent()) {
            if (existente.get().getStatus() == StatusComissao.PAGO) {
                throw new BusinessException(ExceptionMessages.COMISSAO_JA_PAGA_RECALCULO);
            }
            comissaoRepository.delete(existente.get());
            comissaoRepository.flush();
        }

        calcularERegistrarComissao(lancamento);

        return comissaoRepository.findByLancamentoId(lancamentoId)
                .map(this::toResponse)
                .orElseThrow(() -> new BusinessException(ExceptionMessages.COMISSAO_CONFIG_AUSENTE));
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
