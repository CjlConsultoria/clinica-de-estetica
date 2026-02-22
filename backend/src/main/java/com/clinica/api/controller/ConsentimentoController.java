package com.clinica.api.controller;

import com.clinica.api.dto.request.AssinarTermoRequest;
import com.clinica.api.dto.request.TermoRequest;
import com.clinica.api.dto.response.AssinaturaResponse;
import com.clinica.api.dto.response.TermoResponse;
import com.clinica.api.service.ConsentimentoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class ConsentimentoController {

    private final ConsentimentoService consentimentoService;

    @GetMapping("/api/termos")
    public ResponseEntity<List<TermoResponse>> listarTermos(
            @RequestParam(defaultValue = "true") boolean apenasAtivos) {
        return ResponseEntity.ok(apenasAtivos
                ? consentimentoService.listarTermosAtivos()
                : consentimentoService.listarTodosTermos());
    }

    @GetMapping("/api/termos/{id}")
    public ResponseEntity<TermoResponse> buscarTermo(@PathVariable Long id) {
        return ResponseEntity.ok(consentimentoService.buscarTermoPorId(id));
    }

    @PostMapping("/api/termos")
    public ResponseEntity<TermoResponse> criarTermo(@Valid @RequestBody TermoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consentimentoService.criarTermo(request));
    }

    @PutMapping("/api/termos/{id}")
    public ResponseEntity<TermoResponse> atualizarTermo(
            @PathVariable Long id, @Valid @RequestBody TermoRequest request) {
        return ResponseEntity.ok(consentimentoService.atualizarTermo(id, request));
    }

    @DeleteMapping("/api/termos/{id}")
    public ResponseEntity<Void> inativarTermo(@PathVariable Long id) {
        consentimentoService.inativarTermo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/consentimentos")
    public ResponseEntity<List<AssinaturaResponse>> listarTodas() {
        return ResponseEntity.ok(consentimentoService.listarTodasAssinaturas());
    }

    @PostMapping("/api/consentimentos/assinar")
    public ResponseEntity<AssinaturaResponse> assinar(
            @Valid @RequestBody AssinarTermoRequest request,
            HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        return ResponseEntity.status(HttpStatus.CREATED).body(consentimentoService.assinar(request, ip));
    }

    @GetMapping("/api/consentimentos/paciente/{pacienteId}")
    public ResponseEntity<List<AssinaturaResponse>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(consentimentoService.listarAssinaturasPorPaciente(pacienteId));
    }

    @GetMapping("/api/consentimentos/verificar/{hash}")
    public ResponseEntity<AssinaturaResponse> verificar(@PathVariable String hash) {
        Optional<AssinaturaResponse> resultado = consentimentoService.verificarAssinatura(hash);
        return resultado.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
