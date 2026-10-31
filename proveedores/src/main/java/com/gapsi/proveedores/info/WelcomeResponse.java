package com.gapsi.proveedores.info;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Welcome message returned by the API.
 */
// Patrón de diseño: Data Transfer Object
public record WelcomeResponse(
                @Schema(description = "Mensaje de bienvenida", example = "Bienvenido Candidato 01") String message) {
}
