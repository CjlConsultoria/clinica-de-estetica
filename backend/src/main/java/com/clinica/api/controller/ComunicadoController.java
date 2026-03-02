package com.clinica.api.controller;

import com.clinica.api.dto.request.ComunicadoRequest;
import com.clinica.api.dto.response.ComunicadoResponse;
import com.clinica.api.service.ComunicadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comunicados")
@RequiredArgsConstructor
public class ComunicadoController {

    private final ComunicadoService comunicadoService;

    @GetMapping
    public ResponseEntity<List<ComunicadoResponse>> listar() {
        return ResponseEntity.ok(comunicadoService.listarTodos());
    }

    @GetMapping("/admin")
    public ResponseEntity<List<ComunicadoResponse>> listarAdmin() {
        return ResponseEntity.ok(comunicadoService.listarAdmin());
    }

    @PostMapping
    public ResponseEntity<ComunicadoResponse> criar(@Valid @RequestBody ComunicadoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(comunicadoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComunicadoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ComunicadoRequest request) {
        return ResponseEntity.ok(comunicadoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        comunicadoService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
