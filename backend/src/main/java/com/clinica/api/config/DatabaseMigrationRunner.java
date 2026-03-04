package com.clinica.api.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseMigrationRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            jdbcTemplate.execute(
                "ALTER TABLE lotes_produto DROP CONSTRAINT IF EXISTS lotes_produto_status_check"
            );
            jdbcTemplate.execute(
                "ALTER TABLE lotes_produto ADD CONSTRAINT lotes_produto_status_check " +
                "CHECK (status IN ('ATIVO', 'VENCIDO', 'ESGOTADO', 'RECOLHIDO', 'DESCARTADO'))"
            );
            log.info("Constraint lotes_produto_status_check atualizada com sucesso.");
        } catch (Exception e) {
            log.warn("Nao foi possivel atualizar a constraint lotes_produto_status_check: {}", e.getMessage());
        }
    }
}
