package com.clinica.api.config;

import com.clinica.api.entity.Usuario;
import com.clinica.api.enums.Role;
import com.clinica.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {

        int migrated = jdbcTemplate.update(
                "UPDATE usuarios SET role = 'TECNICO' WHERE role = 'MEDICO'"
        );
        if (migrated > 0) {
            log.info("Migração de roles: {} usuário(s) MEDICO → TECNICO", migrated);
        }

        if (usuarioRepository.findByEmail("admin@clinica.com").isEmpty()) {
            Usuario admin = Usuario.builder()
                    .nome("Administrador")
                    .email("admin@clinica.com")
                    .senha(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .ativo(true)
                    .build();

            usuarioRepository.save(admin);
            log.info("Usuário admin criado: admin@clinica.com / Admin@123");
        }
    }
}
