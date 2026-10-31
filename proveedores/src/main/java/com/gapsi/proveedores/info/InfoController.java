package com.gapsi.proveedores.info;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gapsi.proveedores.common.config.AppProperties;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Exposes application welcome and version information.
 */
// Patrón de diseño: Controller (MVC)
@RestController
@RequestMapping("/api/v1")
@Tag(name = "Información", description = "Información general de la aplicación")
public class InfoController {

    private final AppProperties appProperties;

    public InfoController(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @GetMapping("/welcome")
    @Operation(summary = "Obtiene el mensaje de bienvenida")
    @ApiResponse(responseCode = "200", description = "Mensaje de bienvenida")
    public WelcomeResponse welcome() {
        return new WelcomeResponse(appProperties.welcomeMessage());
    }

    @GetMapping("/version")
    @Operation(summary = "Obtiene la versión de la aplicación")
    @ApiResponse(responseCode = "200", description = "Versión de la aplicación")
    public VersionResponse version() {
        return new VersionResponse(appProperties.version());
    }
}
