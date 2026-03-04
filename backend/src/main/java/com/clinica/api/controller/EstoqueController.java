package com.clinica.api.controller;

import com.clinica.api.dto.request.BaixaEstoqueRequest;
import com.clinica.api.dto.request.LoteProdutoRequest;
import com.clinica.api.dto.response.AlertaEstoqueResponse;
import com.clinica.api.dto.response.LoteResponse;
import com.clinica.api.service.EstoqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estoque")
@RequiredArgsConstructor
public class EstoqueController {

    private final EstoqueService estoqueService;

    @GetMapping("/lotes")
    public ResponseEntity<List<LoteResponse>> listarLotes(
            @RequestParam(required = false) Long produtoId) {
        return ResponseEntity.ok(estoqueService.listarLotes(produtoId));
    }

    @GetMapping("/lotes/{id}")
    public ResponseEntity<LoteResponse> buscarLote(@PathVariable Long id) {
        return ResponseEntity.ok(estoqueService.buscarLotePorId(id));
    }

    @PostMapping("/lotes")
    public ResponseEntity<LoteResponse> adicionarLote(@Valid @RequestBody LoteProdutoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(estoqueService.adicionarLote(request));
    }

    @PatchMapping("/lotes/{id}/baixa")
    public ResponseEntity<LoteResponse> darBaixa(
            @PathVariable Long id, @Valid @RequestBody BaixaEstoqueRequest request) {
        return ResponseEntity.ok(estoqueService.darBaixa(id, request.getQuantidade()));
    }

    @DeleteMapping("/lotes/{id}")
    public ResponseEntity<Void> inativarLote(@PathVariable Long id) {
        estoqueService.inativarLote(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/alertas")
    public ResponseEntity<List<AlertaEstoqueResponse>> listarAlertas(
            @RequestParam(defaultValue = "true") boolean apenasNaoLidos) {
        return ResponseEntity.ok(estoqueService.listarAlertas(apenasNaoLidos));
    }

    @PatchMapping("/alertas/{id}/lido")
    public ResponseEntity<Void> marcarAlertaLido(@PathVariable Long id) {
        estoqueService.marcarAlertaLido(id);
        return ResponseEntity.noContent().build();
    }
}
