package com.clinica.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ClinicaApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClinicaApiApplication.class, args);
    }
}
