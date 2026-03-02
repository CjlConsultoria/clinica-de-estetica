package com.clinica.api.controller;

import com.clinica.api.dto.request.NotificacaoRequest;
import com.clinica.api.dto.response.NotificacaoResponse;
import com.clinica.api.service.NotificacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    @GetMapping
    public ResponseEntity<List<NotificacaoResponse>> listar() {
        return ResponseEntity.ok(notificacaoService.listarTodas());
    }

    @GetMapping("/count-nao-lidas")
    public ResponseEntity<Map<String, Long>> contarNaoLidas() {
        return ResponseEntity.ok(notificacaoService.contarNaoLidas());
    }

    @PostMapping
    public ResponseEntity<NotificacaoResponse> criar(@Valid @RequestBody NotificacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificacaoService.criar(request));
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<NotificacaoResponse> marcarComoLida(@PathVariable Long id) {
        return ResponseEntity.ok(notificacaoService.marcarComoLida(id));
    }

    @PatchMapping("/marcar-todas-lidas")
    public ResponseEntity<Void> marcarTodasComoLidas() {
        notificacaoService.marcarTodasComoLidas();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        notificacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/limpar-lidas")
    public ResponseEntity<Void> limparLidas() {
        notificacaoService.limparLidas();
        return ResponseEntity.noContent().build();
    }
}
