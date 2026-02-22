package com.clinica.api.controller;

import com.clinica.api.dto.request.LancamentoRequest;
import com.clinica.api.dto.request.PagamentoRequest;
import com.clinica.api.dto.response.LancamentoResponse;
import com.clinica.api.dto.response.PageResponse;
import com.clinica.api.service.LancamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/financeiro")
@RequiredArgsConstructor
public class FinanceiroController {

    private final LancamentoService lancamentoService;

    @GetMapping("/lancamentos")
    public ResponseEntity<PageResponse<LancamentoResponse>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("criadoEm").descending());
        return ResponseEntity.ok(lancamentoService.listar(pageable));
    }

    @GetMapping("/lancamentos/paciente/{pacienteId}")
    public ResponseEntity<PageResponse<LancamentoResponse>> listarPorPaciente(
            @PathVariable Long pacienteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("criadoEm").descending());
        return ResponseEntity.ok(lancamentoService.listarPorPaciente(pacienteId, pageable));
    }

    @GetMapping("/lancamentos/{id}")
    public ResponseEntity<LancamentoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(lancamentoService.buscarPorId(id));
    }

    @PostMapping("/lancamentos")
    public ResponseEntity<LancamentoResponse> criar(@Valid @RequestBody LancamentoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lancamentoService.criar(request));
    }

    @PatchMapping("/lancamentos/{id}/pagar")
    public ResponseEntity<LancamentoResponse> registrarPagamento(
            @PathVariable Long id,
            @Valid @RequestBody PagamentoRequest request) {
        return ResponseEntity.ok(lancamentoService.registrarPagamento(id, request));
    }

    @PatchMapping("/lancamentos/{id}/cancelar")
    public ResponseEntity<LancamentoResponse> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(lancamentoService.cancelar(id));
    }
}
