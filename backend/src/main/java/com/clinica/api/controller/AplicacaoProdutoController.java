package com.clinica.api.controller;

import com.clinica.api.dto.request.AplicacaoProdutoRequest;
import com.clinica.api.dto.response.AplicacaoProdutoResponse;
import com.clinica.api.service.AplicacaoProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aplicacoes")
@RequiredArgsConstructor
public class AplicacaoProdutoController {

    private final AplicacaoProdutoService aplicacaoService;

    @PostMapping
    public ResponseEntity<AplicacaoProdutoResponse> registrar(
            @Valid @RequestBody AplicacaoProdutoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aplicacaoService.registrar(request));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<AplicacaoProdutoResponse>> listarPorPaciente(
            @PathVariable Long pacienteId) {
        return ResponseEntity.ok(aplicacaoService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/vencendo")
    public ResponseEntity<List<AplicacaoProdutoResponse>> listarVencendo(
            @RequestParam(defaultValue = "7") int dias) {
        return ResponseEntity.ok(aplicacaoService.listarVencendo(dias));
    }
}
