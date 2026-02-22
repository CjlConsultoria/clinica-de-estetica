package com.clinica.api.controller;

import com.clinica.api.dto.request.ProntuarioRequest;
import com.clinica.api.dto.response.PageResponse;
import com.clinica.api.dto.response.ProntuarioResponse;
import com.clinica.api.service.ProntuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prontuarios")
@RequiredArgsConstructor
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<PageResponse<ProntuarioResponse>> listarPorPaciente(
            @PathVariable Long pacienteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("criadoEm").descending());
        return ResponseEntity.ok(prontuarioService.listarPorPaciente(pacienteId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProntuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(prontuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProntuarioResponse> criar(@Valid @RequestBody ProntuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(prontuarioService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProntuarioResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProntuarioRequest request) {
        return ResponseEntity.ok(prontuarioService.atualizar(id, request));
    }
}
