package com.clinica.api.service;

import com.clinica.api.dto.response.AnvisaProdutoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnvisaService {

    private final WebClient anvisaWebClient;

    public Optional<AnvisaProdutoResponse> consultarProduto(String registroAnvisa) {
        try {
            AnvisaProdutoResponse response = anvisaWebClient.get()
                    .uri("/v1/consultas/medicamentos?numRegistro={registro}", registroAnvisa)
                    .retrieve()
                    .bodyToMono(AnvisaProdutoResponse.class)
                    .block();
            return Optional.ofNullable(response);
        } catch (WebClientResponseException e) {
            log.warn("Produto não encontrado na ANVISA para registro {}: {}", registroAnvisa, e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            log.error("Erro ao consultar ANVISA para registro {}: {}", registroAnvisa, e.getMessage());
            return Optional.empty();
        }
    }
}
