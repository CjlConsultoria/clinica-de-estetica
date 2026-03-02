package com.clinica.api.controller;

import com.clinica.api.dto.request.SuporteTicketRequest;
import com.clinica.api.dto.response.SuporteTicketResponse;
import com.clinica.api.service.SuporteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suporte")
@RequiredArgsConstructor
public class SuporteController {

    private final SuporteService suporteService;

    @GetMapping
    public ResponseEntity<List<SuporteTicketResponse>> listar() {
        return ResponseEntity.ok(suporteService.listarTodos());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SuporteTicketResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(suporteService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<SuporteTicketResponse>> listarPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(suporteService.listarPorEmpresa(empresaId));
    }

    @PostMapping
    public ResponseEntity<SuporteTicketResponse> criar(@Valid @RequestBody SuporteTicketRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(suporteService.criar(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SuporteTicketResponse> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(suporteService.atualizarStatus(id, body.get("status")));
    }
}
