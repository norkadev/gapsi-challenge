package com.gapsi.proveedores.info;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Application version returned by the API.
 */
// Patrón de diseño: Data Transfer Object
public record VersionResponse(
        @Schema(description = "Versión de la aplicación", example = "0.0.1-SNAPSHOT")
        String version) {
}
