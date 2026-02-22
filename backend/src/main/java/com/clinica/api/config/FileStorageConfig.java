package com.clinica.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {

    @Value("${app.upload.dir:./uploads/fotos}")
    private String uploadDir;

    public Path getUploadPath() {
        Path path = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(path);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar o diretório de uploads: " + path, e);
        }
        return path;
    }

    public Path getUploadPath(Long pacienteId) {
        Path path = getUploadPath().resolve(String.valueOf(pacienteId));
        try {
            Files.createDirectories(path);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar o diretório do paciente: " + path, e);
        }
        return path;
    }
}
