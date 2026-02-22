package com.clinica.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient anvisaWebClient() {
        return WebClient.builder()
                .baseUrl("https://consultas.anvisa.gov.br/api")
                .defaultHeader("Accept", "application/json")
                .defaultHeader("User-Agent", "ClinicaEstetica/1.0")
                .build();
    }
}
