package com.clinica.api.controller;

import com.clinica.api.dto.request.FaturaRequest;
import com.clinica.api.dto.response.FaturaResponse;
import com.clinica.api.service.FaturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faturas")
@RequiredArgsConstructor
public class FaturaController {

    private final FaturaService faturaService;

    @GetMapping
    public ResponseEntity<List<FaturaResponse>> listar() {
        return ResponseEntity.ok(faturaService.listar());
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<FaturaResponse>> listarPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(faturaService.listarPorEmpresa(empresaId));
    }

    @PostMapping
    public ResponseEntity<FaturaResponse> criar(@RequestBody FaturaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(faturaService.criar(request));
    }

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<FaturaResponse> pagar(@PathVariable Long id) {
        return ResponseEntity.ok(faturaService.pagar(id));
    }
}
