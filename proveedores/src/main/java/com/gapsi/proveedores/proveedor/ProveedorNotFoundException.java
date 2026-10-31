package com.gapsi.proveedores.proveedor;

/**
 * Raised when the requested supplier does not exist.
 */
public class ProveedorNotFoundException extends RuntimeException {

    public ProveedorNotFoundException(Long id) {
        super("No se encontró el proveedor con id: " + id);
    }
}
