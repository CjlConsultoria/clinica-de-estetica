package com.clinica.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketMensagemResponse {
    private Long id;
    private Long ticketId;
    private String autor;
    private Boolean fromSupport;
    private String texto;
    private LocalDateTime criadoEm;
}
