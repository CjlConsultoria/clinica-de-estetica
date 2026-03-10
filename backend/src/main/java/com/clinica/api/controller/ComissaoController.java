package com.clinica.api.controller;

import com.clinica.api.dto.request.ComissaoConfigRequest;
import com.clinica.api.dto.response.ComissaoResponse;
import com.clinica.api.dto.response.ComissaoResumoResponse;
import com.clinica.api.entity.ComissaoConfig;
import com.clinica.api.service.ComissaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comissoes")
@RequiredArgsConstructor
public class ComissaoController {

    private final ComissaoService comissaoService;

    @GetMapping
    public ResponseEntity<List<ComissaoResponse>> listarTodas() {
        return ResponseEntity.ok(comissaoService.listarTodas());
    }

    @GetMapping("/medico/{usuarioId}")
    public ResponseEntity<List<ComissaoResponse>> listarPorMedico(
            @PathVariable Long usuarioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        if (inicio != null && fim != null) {
            return ResponseEntity.ok(comissaoService.listarPorMedicoEPeriodo(usuarioId, inicio, fim));
        }
        return ResponseEntity.ok(comissaoService.listarPorMedico(usuarioId));
    }

    @GetMapping("/medico/{usuarioId}/resumo")
    public ResponseEntity<ComissaoResumoResponse> resumo(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(comissaoService.resumoPorMedico(usuarioId));
    }

    @PatchMapping("/{id}/pagar")
    public ResponseEntity<ComissaoResponse> pagar(@PathVariable Long id) {
        return ResponseEntity.ok(comissaoService.pagar(id));
    }

    @GetMapping("/config/{usuarioId}")
    public ResponseEntity<ComissaoConfig> buscarConfig(@PathVariable Long usuarioId) {
        Optional<ComissaoConfig> config = comissaoService.buscarConfig(usuarioId);
        return config.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/config")
    public ResponseEntity<ComissaoConfig> salvarConfig(@Valid @RequestBody ComissaoConfigRequest request) {
        return ResponseEntity.ok(comissaoService.salvarConfig(request));
    }

    @PostMapping("/recalcular/{lancamentoId}")
    public ResponseEntity<ComissaoResponse> recalcular(@PathVariable Long lancamentoId) {
        return ResponseEntity.ok(comissaoService.recalcularComissao(lancamentoId));
    }
}
