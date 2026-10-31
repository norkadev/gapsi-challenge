package com.gapsi.proveedores;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.gapsi.proveedores.common.config.AppProperties;
import com.gapsi.proveedores.proveedor.ProveedorRepository;

/**
 * Integration checks for application configuration and development seed data.
 */
@SpringBootTest
class ProveedoresApplicationTests {

    @Autowired
    private AppProperties appProperties;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Test
    void application_devConfiguration_hasVersionAndFortySeededSuppliers() {
        assertThat(appProperties.version()).isEqualTo("0.0.1");
        assertThat(proveedorRepository.count()).isEqualTo(40);
    }
}
