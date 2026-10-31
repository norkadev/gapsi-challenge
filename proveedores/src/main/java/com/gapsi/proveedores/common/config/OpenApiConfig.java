package com.gapsi.proveedores.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

/**
 * Publishes the API metadata used by springdoc.
 */
@Configuration
public class OpenApiConfig {

    private final AppProperties appProperties;

    public OpenApiConfig(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Bean
    public OpenAPI proveedoresOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Proveedores API")
                        .version(appProperties.version())
                        .description("API REST para consultar y administrar proveedores."));
    }
}
