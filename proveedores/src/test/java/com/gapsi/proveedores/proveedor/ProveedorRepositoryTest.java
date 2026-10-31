package com.gapsi.proveedores.proveedor;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

/**
 * Persistence tests for supplier queries.
 */
@DataJpaTest
class ProveedorRepositoryTest {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Test
    void existsByNombre_proveedorPersistido_devuelveTrue() {
        proveedorRepository.save(new Proveedor(
                "Proveedor Uno", "Proveedor Uno S.A. de C.V.", "Calle Principal 1"));

        assertThat(proveedorRepository.existsByNombre("Proveedor Uno")).isTrue();
    }
}
