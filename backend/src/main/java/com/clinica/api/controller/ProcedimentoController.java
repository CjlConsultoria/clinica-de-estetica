package com.clinica.api.controller;

import com.clinica.api.dto.request.ProcedimentoRequest;
import com.clinica.api.dto.response.ProcedimentoResponse;
import com.clinica.api.service.ProcedimentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procedimentos")
@RequiredArgsConstructor
public class ProcedimentoController {

    private final ProcedimentoService procedimentoService;

    @GetMapping
    public ResponseEntity<List<ProcedimentoResponse>> listar(
            @RequestParam(defaultValue = "true") boolean apenasAtivos) {
        return ResponseEntity.ok(procedimentoService.listar(apenasAtivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProcedimentoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(procedimentoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProcedimentoResponse> criar(@Valid @RequestBody ProcedimentoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(procedimentoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProcedimentoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProcedimentoRequest request) {
        return ResponseEntity.ok(procedimentoService.atualizar(id, request));
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        procedimentoService.inativar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<Void> ativar(@PathVariable Long id) {
        procedimentoService.ativar(id);
        return ResponseEntity.noContent().build();
    }
}
