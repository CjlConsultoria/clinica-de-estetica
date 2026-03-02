package com.clinica.api.service;

import com.clinica.api.dto.request.LancamentoRequest;
import com.clinica.api.dto.request.PagamentoRequest;
import com.clinica.api.dto.response.LancamentoResponse;
import com.clinica.api.dto.response.PageResponse;
import com.clinica.api.entity.Agendamento;
import com.clinica.api.entity.Lancamento;
import com.clinica.api.entity.Paciente;
import com.clinica.api.entity.Usuario;
import com.clinica.api.enums.StatusPagamento;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ExceptionMessages;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.AgendamentoRepository;
import com.clinica.api.repository.LancamentoRepository;
import com.clinica.api.repository.PacienteRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class LancamentoService {

    private final LancamentoRepository lancamentoRepository;
    private final PacienteRepository pacienteRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final ComissaoService comissaoService;

    public LancamentoService(LancamentoRepository lancamentoRepository,
                              PacienteRepository pacienteRepository,
                              AgendamentoRepository agendamentoRepository,
                              @Lazy ComissaoService comissaoService) {
        this.lancamentoRepository = lancamentoRepository;
        this.pacienteRepository = pacienteRepository;
        this.agendamentoRepository = agendamentoRepository;
        this.comissaoService = comissaoService;
    }

    private Long getEmpresaId() {
        Usuario u = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return u.getEmpresaId();
    }

    public PageResponse<LancamentoResponse> listar(Pageable pageable) {
        Long empresaId = getEmpresaId();
        if (empresaId != null) {
            return PageResponse.of(lancamentoRepository.findByEmpresaId(empresaId, pageable).map(this::toResponse));
        }
        return PageResponse.of(lancamentoRepository.findAll(pageable).map(this::toResponse));
    }

    public PageResponse<LancamentoResponse> listarPorPaciente(Long pacienteId, Pageable pageable) {
        return PageResponse.of(lancamentoRepository.findByPacienteId(pacienteId, pageable).map(this::toResponse));
    }

    public LancamentoResponse buscarPorId(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public LancamentoResponse criar(LancamentoRequest request) {
        Paciente paciente = pacienteRepository.findById(request.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente", request.getPacienteId()));

        Agendamento agendamento = null;
        if (request.getAgendamentoId() != null) {
            agendamento = agendamentoRepository.findById(request.getAgendamentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agendamento", request.getAgendamentoId()));
        }

        BigDecimal desconto = request.getValorDesconto() != null ? request.getValorDesconto() : BigDecimal.ZERO;

        Lancamento lancamento = Lancamento.builder()
                .paciente(paciente)
                .agendamento(agendamento)
                .valor(request.getValor())
                .valorDesconto(desconto)
                .formaPagamento(request.getFormaPagamento())
                .status(StatusPagamento.PENDENTE)
                .dataVencimento(request.getDataVencimento())
                .descricao(request.getDescricao())
                .observacoes(request.getObservacoes())
                .numeroRecibo(gerarNumeroRecibo())
                .empresaId(getEmpresaId())
                .build();

        return toResponse(lancamentoRepository.save(lancamento));
    }

    @Transactional
    public LancamentoResponse registrarPagamento(Long id, PagamentoRequest request) {
        Lancamento lancamento = findById(id);

        if (lancamento.getStatus() == StatusPagamento.PAGO) {
            throw new BusinessException(ExceptionMessages.LANCAMENTO_JA_PAGO);
        }
        if (lancamento.getStatus() == StatusPagamento.CANCELADO) {
            throw new BusinessException(ExceptionMessages.LANCAMENTO_CANCELADO);
        }

        lancamento.setStatus(StatusPagamento.PAGO);
        lancamento.setFormaPagamento(request.getFormaPagamento());
        lancamento.setDataPagamento(request.getDataPagamento());

        if (request.getObservacoes() != null) {
            lancamento.setObservacoes(request.getObservacoes());
        }

        Lancamento salvo = lancamentoRepository.save(lancamento);

        comissaoService.calcularERegistrarComissao(salvo);

        return toResponse(salvo);
    }

    @Transactional
    public LancamentoResponse cancelar(Long id) {
        Lancamento lancamento = findById(id);

        if (lancamento.getStatus() == StatusPagamento.PAGO) {
            throw new BusinessException(ExceptionMessages.LANCAMENTO_NAO_CANCELAVEL);
        }

        lancamento.setStatus(StatusPagamento.CANCELADO);
        return toResponse(lancamentoRepository.save(lancamento));
    }

    private String gerarNumeroRecibo() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +
               "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private Lancamento findById(Long id) {
        return lancamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lançamento", id));
    }

    private LancamentoResponse toResponse(Lancamento lancamento) {
        BigDecimal valorLiquido = lancamento.getValor().subtract(
                lancamento.getValorDesconto() != null ? lancamento.getValorDesconto() : BigDecimal.ZERO
        );

        return LancamentoResponse.builder()
                .id(lancamento.getId())
                .agendamentoId(lancamento.getAgendamento() != null ? lancamento.getAgendamento().getId() : null)
                .pacienteId(lancamento.getPaciente().getId())
                .pacienteNome(lancamento.getPaciente().getNome())
                .valor(lancamento.getValor())
                .valorDesconto(lancamento.getValorDesconto())
                .valorLiquido(valorLiquido)
                .formaPagamento(lancamento.getFormaPagamento())
                .status(lancamento.getStatus())
                .dataVencimento(lancamento.getDataVencimento())
                .dataPagamento(lancamento.getDataPagamento())
                .descricao(lancamento.getDescricao())
                .numeroRecibo(lancamento.getNumeroRecibo())
                .observacoes(lancamento.getObservacoes())
                .criadoEm(lancamento.getCriadoEm())
                .build();
    }
}
