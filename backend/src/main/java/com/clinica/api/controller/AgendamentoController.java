package com.clinica.api.controller;

import com.clinica.api.dto.request.AgendamentoRequest;
import com.clinica.api.dto.request.AgendamentoStatusRequest;
import com.clinica.api.dto.response.AgendamentoResponse;
import com.clinica.api.dto.response.PageResponse;
import com.clinica.api.service.AgendamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    @GetMapping
    public ResponseEntity<PageResponse<AgendamentoResponse>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dataHora"));
        return ResponseEntity.ok(agendamentoService.listar(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.buscarPorId(id));
    }

    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<PageResponse<AgendamentoResponse>> listarPorMedico(
            @PathVariable Long medicoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dataHora"));
        return ResponseEntity.ok(agendamentoService.listarPorMedico(medicoId, pageable));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<PageResponse<AgendamentoResponse>> listarPorPaciente(
            @PathVariable Long pacienteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dataHora").descending());
        return ResponseEntity.ok(agendamentoService.listarPorPaciente(pacienteId, pageable));
    }

    @GetMapping("/agenda/{medicoId}")
    public ResponseEntity<List<AgendamentoResponse>> agenda(
            @PathVariable Long medicoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(agendamentoService.listarPorMedicoEPeriodo(medicoId, inicio, fim));
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponse> criar(@Valid @RequestBody AgendamentoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agendamentoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AgendamentoRequest request) {
        return ResponseEntity.ok(agendamentoService.atualizar(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AgendamentoResponse> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AgendamentoStatusRequest request) {
        return ResponseEntity.ok(agendamentoService.atualizarStatus(id, request));
    }
}
