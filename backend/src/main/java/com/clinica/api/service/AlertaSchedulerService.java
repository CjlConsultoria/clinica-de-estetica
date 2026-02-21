package com.clinica.api.service;

import com.clinica.api.entity.AplicacaoProduto;
import com.clinica.api.repository.AplicacaoProdutoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertaSchedulerService {

    private final AplicacaoProdutoRepository aplicacaoRepository;
    private final AlertaService alertaService;
    private final EstoqueService estoqueService;

    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void verificarAlertas() {
        log.info("Iniciando verificação de alertas agendada...");
        verificarReaplicacoes();
        estoqueService.gerarAlertasPreditivos();
        log.info("Verificação de alertas concluída.");
    }

    public void verificarReaplicacoes() {
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(7);

        List<AplicacaoProduto> vencendo = aplicacaoRepository.findAplicacoesVencendoEm(hoje, limite);
        log.info("Encontradas {} reaplicações nos próximos 7 dias", vencendo.size());

        for (AplicacaoProduto aplicacao : vencendo) {
            alertaService.criarAlertaParaAplicacao(aplicacao);
        }
    }
}
