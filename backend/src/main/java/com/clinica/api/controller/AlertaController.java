package com.clinica.api.controller;

import com.clinica.api.dto.response.AlertaResponse;
import com.clinica.api.service.AlertaSchedulerService;
import com.clinica.api.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaService alertaService;
    private final AlertaSchedulerService schedulerService;

    @GetMapping
    public ResponseEntity<List<AlertaResponse>> listar() {
        return ResponseEntity.ok(alertaService.listarTodos());
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<AlertaResponse>> listarPendentes() {
        return ResponseEntity.ok(alertaService.listarPendentes());
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<AlertaResponse>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(alertaService.listarPorPaciente(pacienteId));
    }

    @PatchMapping("/{id}/lido")
    public ResponseEntity<Void> marcarLido(@PathVariable Long id) {
        alertaService.marcarLido(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/executar-verificacao")
    public ResponseEntity<Void> executarVerificacao() {
        schedulerService.verificarAlertas();
        return ResponseEntity.ok().build();
    }
}
