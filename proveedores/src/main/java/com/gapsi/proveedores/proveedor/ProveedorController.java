package com.gapsi.proveedores.proveedor;

import java.net.URI;
import java.util.Set;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.gapsi.proveedores.proveedor.dto.ProveedorRequest;
import com.gapsi.proveedores.proveedor.dto.ProveedorResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * HTTP endpoints for supplier management.
 */
// Patrón de diseño: Controller (MVC)
@RestController
@RequestMapping("/api/v1/proveedores")
@Tag(name = "Proveedores", description = "Consulta, registro y eliminación de proveedores")
public class ProveedorController {

    private static final Set<String> SORTABLE_PROPERTIES = Set.of("nombre", "razonSocial", "direccion");

    private final ProveedorService proveedorService;

    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @GetMapping
    @Operation(summary = "Lista proveedores de forma paginada")
    @ApiResponse(responseCode = "200", description = "Página de proveedores")
    @ApiResponse(responseCode = "400", description = "Parámetros de paginación u orden inválidos",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public Page<ProveedorResponse> listar(
            @ParameterObject @PageableDefault(size = 20) Pageable pageable) {
        for (Sort.Order order : pageable.getSort()) {
            if (!SORTABLE_PROPERTIES.contains(order.getProperty())) {
                throw new ProveedorSortFieldException(order.getProperty());
            }
        }
        return proveedorService.listar(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtiene un proveedor por su identificador")
    @ApiResponse(responseCode = "200", description = "Proveedor encontrado")
    @ApiResponse(responseCode = "404", description = "Proveedor no encontrado",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ProveedorResponse buscarPorId(@PathVariable Long id) {
        return proveedorService.buscarPorId(id);
    }

    @PostMapping
    @Operation(summary = "Registra un proveedor")
    @ApiResponse(responseCode = "201", description = "Proveedor creado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    @ApiResponse(responseCode = "409", description = "El nombre ya existe",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<ProveedorResponse> crear(@Valid @RequestBody ProveedorRequest request) {
        ProveedorResponse creado = proveedorService.crear(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(creado.id())
                .toUri();
        return ResponseEntity.created(location).body(creado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina un proveedor")
    @ApiResponse(responseCode = "204", description = "Proveedor eliminado")
    @ApiResponse(responseCode = "404", description = "Proveedor no encontrado",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        proveedorService.eliminar(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
