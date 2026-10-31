package com.gapsi.proveedores.proveedor;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Persistence operations for suppliers.
 */
// Patrón de diseño: Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    boolean existsByNombre(String nombre);
}
