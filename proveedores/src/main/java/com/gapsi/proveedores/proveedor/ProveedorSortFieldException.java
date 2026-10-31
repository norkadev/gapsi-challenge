package com.gapsi.proveedores.proveedor;

/**
 * Indicates that a requested supplier sort field is not supported.
 */
public class ProveedorSortFieldException extends RuntimeException {

    private final String property;

    public ProveedorSortFieldException(String property) {
        super("Unsupported supplier sort field: " + property);
        this.property = property;
    }

    public String getProperty() {
        return property;
    }
}
