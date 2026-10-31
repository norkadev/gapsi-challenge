package com.gapsi.proveedores.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * External configuration shared by the API features.
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(String version, String welcomeMessage, Cors cors) {

    /**
     * CORS settings for the configured frontend origin.
     */
    public record Cors(String allowedOrigin) {
    }
}
