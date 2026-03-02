package com.clinica.api.controller;

import com.clinica.api.dto.request.TicketMensagemRequest;
import com.clinica.api.dto.response.TicketMensagemResponse;
import com.clinica.api.service.TicketMensagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suporte/{ticketId}/mensagens")
@RequiredArgsConstructor
public class TicketMensagemController {

    private final TicketMensagemService ticketMensagemService;

    @GetMapping
    public ResponseEntity<List<TicketMensagemResponse>> listar(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketMensagemService.listarPorTicket(ticketId));
    }

    @PostMapping
    public ResponseEntity<TicketMensagemResponse> criar(
            @PathVariable Long ticketId,
            @Valid @RequestBody TicketMensagemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketMensagemService.criar(ticketId, request));
    }
}
