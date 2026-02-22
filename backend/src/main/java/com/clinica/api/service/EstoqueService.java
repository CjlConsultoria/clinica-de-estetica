package com.clinica.api.service;

import com.clinica.api.dto.request.LoteProdutoRequest;
import com.clinica.api.dto.response.AlertaEstoqueResponse;
import com.clinica.api.dto.response.LoteResponse;
import com.clinica.api.entity.AlertaEstoque;
import com.clinica.api.entity.LoteProduto;
import com.clinica.api.entity.Produto;
import com.clinica.api.enums.StatusLote;
import com.clinica.api.enums.TipoAlertaEstoque;
import com.clinica.api.exception.BusinessException;
import com.clinica.api.exception.ResourceNotFoundException;
import com.clinica.api.repository.AlertaEstoqueRepository;
import com.clinica.api.repository.LoteProdutoRepository;
import com.clinica.api.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EstoqueService {

    private final LoteProdutoRepository loteProdutoRepository;
    private final ProdutoRepository produtoRepository;
    private final AlertaEstoqueRepository alertaEstoqueRepository;

    public List<LoteResponse> listarLotes(Long produtoId) {
        List<LoteProduto> lotes = (produtoId != null)
                ? loteProdutoRepository.findByProdutoId(produtoId)
                : loteProdutoRepository.findEstoqueAtivo();
        return lotes.stream().map(this::toResponse).toList();
    }

    public LoteResponse buscarLotePorId(Long id) {
        return toResponse(findLoteById(id));
    }

    @Transactional
    public LoteResponse adicionarLote(LoteProdutoRequest request) {
        Produto produto = produtoRepository.findById(request.getProdutoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto", request.getProdutoId()));

        if (request.getDataValidade().isBefore(LocalDate.now())) {
            throw new BusinessException("Data de validade não pode ser no passado");
        }

        LoteProduto lote = LoteProduto.builder()
                .produto(produto)
                .numeroLote(request.getNumeroLote())
                .dataFabricacao(request.getDataFabricacao())
                .dataValidade(request.getDataValidade())
                .quantidadeTotal(request.getQuantidadeTotal())
                .quantidadeAtual(request.getQuantidadeTotal())
                .fornecedor(request.getFornecedor())
                .notaFiscal(request.getNotaFiscal())
                .status(StatusLote.ATIVO)
                .build();

        return toResponse(loteProdutoRepository.save(lote));
    }

    @Transactional
    public LoteResponse darBaixa(Long loteId, Integer quantidade) {
        LoteProduto lote = findLoteById(loteId);

        if (lote.getStatus() != StatusLote.ATIVO) {
            throw new BusinessException("Lote não está ativo: " + lote.getStatus());
        }
        if (lote.getQuantidadeAtual() < quantidade) {
            throw new BusinessException("Estoque insuficiente. Disponível: " + lote.getQuantidadeAtual());
        }

        lote.setQuantidadeAtual(lote.getQuantidadeAtual() - quantidade);

        if (lote.getQuantidadeAtual() == 0) {
            lote.setStatus(StatusLote.ESGOTADO);
        }

        return toResponse(loteProdutoRepository.save(lote));
    }

    @Transactional
    public void gerarAlertasPreditivos() {
        List<AlertaEstoque> novosAlertas = new ArrayList<>();
        LocalDate hoje = LocalDate.now();


        List<LoteProduto> vencendoEm60Dias = loteProdutoRepository.findValidadeProxima(hoje.plusDays(60));
        for (LoteProduto lote : vencendoEm60Dias) {
            if (!alertaEstoqueRepository.existsByLoteIdAndTipoAndLidoFalse(lote.getId(), TipoAlertaEstoque.VALIDADE_PROXIMA)) {
                String mensagem = String.format("Lote %s do produto '%s' vence em %s",
                        lote.getNumeroLote(), lote.getProduto().getNome(), lote.getDataValidade());
                novosAlertas.add(AlertaEstoque.builder()
                        .lote(lote)
                        .tipo(TipoAlertaEstoque.VALIDADE_PROXIMA)
                        .mensagem(mensagem)
                        .dataAlerta(LocalDateTime.now())
                        .build());
            }
        }


        List<LoteProduto> estoqueCritico = loteProdutoRepository.findEstoqueBaixo(0.10);
        for (LoteProduto lote : estoqueCritico) {
            if (!alertaEstoqueRepository.existsByLoteIdAndTipoAndLidoFalse(lote.getId(), TipoAlertaEstoque.ESTOQUE_CRITICO)) {
                String mensagem = String.format("Estoque crítico: Lote %s do produto '%s' com apenas %d unidades",
                        lote.getNumeroLote(), lote.getProduto().getNome(), lote.getQuantidadeAtual());
                novosAlertas.add(AlertaEstoque.builder()
                        .lote(lote)
                        .tipo(TipoAlertaEstoque.ESTOQUE_CRITICO)
                        .mensagem(mensagem)
                        .dataAlerta(LocalDateTime.now())
                        .build());
            }
        }


        List<LoteProduto> estoqueBaixo = loteProdutoRepository.findEstoqueBaixo(0.30);
        for (LoteProduto lote : estoqueBaixo) {
            double pct = (double) lote.getQuantidadeAtual() / lote.getQuantidadeTotal();
            if (pct > 0.10 && !alertaEstoqueRepository.existsByLoteIdAndTipoAndLidoFalse(lote.getId(), TipoAlertaEstoque.ESTOQUE_BAIXO)) {
                String mensagem = String.format("Estoque baixo: Lote %s do produto '%s' com %d%% restante",
                        lote.getNumeroLote(), lote.getProduto().getNome(), (int)(pct * 100));
                novosAlertas.add(AlertaEstoque.builder()
                        .lote(lote)
                        .tipo(TipoAlertaEstoque.ESTOQUE_BAIXO)
                        .mensagem(mensagem)
                        .dataAlerta(LocalDateTime.now())
                        .build());
            }
        }


        List<LoteProduto> vencidos = loteProdutoRepository.findVencidosAntes(hoje);
        for (LoteProduto lote : vencidos) {
            lote.setStatus(StatusLote.VENCIDO);
            loteProdutoRepository.save(lote);
            if (!alertaEstoqueRepository.existsByLoteIdAndTipoAndLidoFalse(lote.getId(), TipoAlertaEstoque.VALIDADE_PROXIMA)) {
                novosAlertas.add(AlertaEstoque.builder()
                        .lote(lote)
                        .tipo(TipoAlertaEstoque.VALIDADE_PROXIMA)
                        .mensagem("Lote " + lote.getNumeroLote() + " do produto '" + lote.getProduto().getNome() + "' está VENCIDO")
                        .dataAlerta(LocalDateTime.now())
                        .build());
            }
        }

        if (!novosAlertas.isEmpty()) {
            alertaEstoqueRepository.saveAll(novosAlertas);
            log.info("Gerados {} alertas de estoque", novosAlertas.size());
        }
    }

    public List<AlertaEstoqueResponse> listarAlertas(boolean apenasNaoLidos) {
        List<AlertaEstoque> alertas = apenasNaoLidos
                ? alertaEstoqueRepository.findByLidoFalse()
                : alertaEstoqueRepository.findAll();
        return alertas.stream().map(this::toAlertaResponse).toList();
    }

    @Transactional
    public void marcarAlertaLido(Long alertaId) {
        AlertaEstoque alerta = alertaEstoqueRepository.findById(alertaId)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta de estoque", alertaId));
        alerta.setLido(true);
        alertaEstoqueRepository.save(alerta);
    }

    private LoteProduto findLoteById(Long id) {
        return loteProdutoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lote", id));
    }

    private LoteResponse toResponse(LoteProduto lote) {
        return LoteResponse.builder()
                .id(lote.getId())
                .produtoId(lote.getProduto().getId())
                .produtoNome(lote.getProduto().getNome())
                .produtoCategoria(lote.getProduto().getCategoria())
                .produtoUnidade(lote.getProduto().getUnidade())
                .produtoFabricante(lote.getProduto().getFabricante())
                .produtoRegistroAnvisa(lote.getProduto().getRegistroAnvisa())
                .numeroLote(lote.getNumeroLote())
                .dataFabricacao(lote.getDataFabricacao())
                .dataValidade(lote.getDataValidade())
                .quantidadeTotal(lote.getQuantidadeTotal())
                .quantidadeAtual(lote.getQuantidadeAtual())
                .fornecedor(lote.getFornecedor())
                .notaFiscal(lote.getNotaFiscal())
                .status(lote.getStatus())
                .ativo(lote.isAtivo())
                .criadoEm(lote.getCriadoEm())
                .build();
    }

    private AlertaEstoqueResponse toAlertaResponse(AlertaEstoque alerta) {
        return AlertaEstoqueResponse.builder()
                .id(alerta.getId())
                .loteId(alerta.getLote().getId())
                .numeroLote(alerta.getLote().getNumeroLote())
                .produtoNome(alerta.getLote().getProduto().getNome())
                .tipo(alerta.getTipo())
                .mensagem(alerta.getMensagem())
                .dataAlerta(alerta.getDataAlerta())
                .lido(alerta.isLido())
                .build();
    }
}
