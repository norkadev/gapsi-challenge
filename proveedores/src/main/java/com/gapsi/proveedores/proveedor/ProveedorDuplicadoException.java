package com.gapsi.proveedores.proveedor;

/**
 * Raised when a supplier name is already in use.
 */
public class ProveedorDuplicadoException extends RuntimeException {

    public ProveedorDuplicadoException(String nombre) {
        super("Ya existe un proveedor con el nombre: " + nombre);
    }
}
