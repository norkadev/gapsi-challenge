package com.gapsi.proveedores.proveedor.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/**
 * Validated supplier data accepted by the create endpoint.
 */
// Patrón de diseño: Data Transfer Object
public record ProveedorRequest(
        @NotBlank
        @Schema(description = "Nombre único del proveedor", example = "Suministros del Centro")
        String nombre,
        @NotBlank
        @Schema(description = "Razón social del proveedor", example = "Suministros del Centro S.A. de C.V.")
        String razonSocial,
        @NotBlank
        @Schema(description = "Dirección del proveedor", example = "Av. Reforma 100, Ciudad de México")
        String direccion) {
}
