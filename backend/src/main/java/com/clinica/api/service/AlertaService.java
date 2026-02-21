package com.clinica.api.service;

import com.clinica.api.dto.response.AlertaResponse;
import com.clinica.api.entity.AlertaReaplicacao;
import com.clinica.api.entity.AplicacaoProduto;
import com.clinica.api.enums.StatusAlerta;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.AlertaReaplicacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertaService {

    private final AlertaReaplicacaoRepository alertaRepository;

    public List<AlertaResponse> listarTodos() {
        return alertaRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<AlertaResponse> listarPendentes() {
        return alertaRepository.findByLidoFalseOrderByCriadoEmDesc()
                .stream().map(this::toResponse).toList();
    }

    public List<AlertaResponse> listarPorPaciente(Long pacienteId) {
        return alertaRepository.findByPacienteIdOrderByCriadoEmDesc(pacienteId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void marcarLido(Long alertaId) {
        AlertaReaplicacao alerta = alertaRepository.findById(alertaId)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta", alertaId));
        alerta.setLido(true);
        alerta.setStatus(StatusAlerta.LIDO);
        alertaRepository.save(alerta);
    }

    @Transactional
    public void criarAlertaParaAplicacao(AplicacaoProduto aplicacao) {
        if (aplicacao.getDataProximaAplicacao() == null) return;
        if (alertaRepository.existsByAplicacaoIdAndLidoFalse(aplicacao.getId())) return;

        String mensagem = String.format(
                "Paciente %s precisa de reaplicação de '%s' em %s",
                aplicacao.getPaciente().getNome(),
                aplicacao.getLote().getProduto().getNome(),
                aplicacao.getDataProximaAplicacao());

        AlertaReaplicacao alerta = AlertaReaplicacao.builder()
                .paciente(aplicacao.getPaciente())
                .aplicacao(aplicacao)
                .dataAlerta(aplicacao.getDataProximaAplicacao())
                .mensagem(mensagem)
                .status(StatusAlerta.PENDENTE)
                .build();

        alertaRepository.save(alerta);
    }

    private AlertaResponse toResponse(AlertaReaplicacao a) {
        return AlertaResponse.builder()
                .id(a.getId())
                .pacienteId(a.getPaciente().getId())
                .pacienteNome(a.getPaciente().getNome())
                .aplicacaoId(a.getAplicacao().getId())
                .produtoNome(a.getAplicacao().getLote().getProduto().getNome())
                .dataAlerta(a.getDataAlerta())
                .mensagem(a.getMensagem())
                .status(a.getStatus())
                .lido(a.isLido())
                .criadoEm(a.getCriadoEm())
                .build();
    }
}
