package com.gapsi.proveedores.proveedor.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Supplier data exposed by the API.
 */
// Patrón de diseño: Data Transfer Object
public record ProveedorResponse(
        @Schema(description = "Identificador del proveedor", example = "1")
        Long id,
        @Schema(description = "Nombre único del proveedor", example = "Suministros del Centro")
        String nombre,
        @Schema(description = "Razón social del proveedor", example = "Suministros del Centro S.A. de C.V.")
        String razonSocial,
        @Schema(description = "Dirección del proveedor", example = "Av. Reforma 100, Ciudad de México")
        String direccion) {
}
