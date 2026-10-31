package com.gapsi.proveedores.proveedor;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.gapsi.proveedores.proveedor.dto.ProveedorRequest;
import com.gapsi.proveedores.proveedor.dto.ProveedorResponse;

/**
 * Unit tests for supplier business operations.
 */
class ProveedorServiceTest {

    @Test
    void crear_nombreNuevo_devuelveProveedorCreado() {
        ProveedorRepository repository = mock(ProveedorRepository.class);
        ProveedorService service = new ProveedorService(repository);
        ProveedorRequest request = new ProveedorRequest(
                "Proveedor Uno", "Proveedor Uno S.A. de C.V.", "Calle Principal 1");
        Proveedor proveedor = new Proveedor(
                request.nombre(), request.razonSocial(), request.direccion());
        when(repository.existsByNombre(request.nombre())).thenReturn(false);
        when(repository.save(any(Proveedor.class))).thenReturn(proveedor);

        ProveedorResponse response = service.crear(request);

        assertThat(response.nombre()).isEqualTo(request.nombre());
        verify(repository).save(any(Proveedor.class));
    }

    @Test
    void crear_nombreExistente_lanzaExcepcionDeConflicto() {
        ProveedorRepository repository = mock(ProveedorRepository.class);
        ProveedorService service = new ProveedorService(repository);
        ProveedorRequest request = new ProveedorRequest(
                "Proveedor Uno", "Proveedor Uno S.A. de C.V.", "Calle Principal 1");
        when(repository.existsByNombre(request.nombre())).thenReturn(true);

        assertThatThrownBy(() -> service.crear(request))
                .isInstanceOf(ProveedorDuplicadoException.class);
        verify(repository, never()).save(any(Proveedor.class));
    }

    @Test
    void eliminar_proveedorInexistente_lanzaExcepcionNotFound() {
        ProveedorRepository repository = mock(ProveedorRepository.class);
        ProveedorService service = new ProveedorService(repository);
        when(repository.findById(7L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.eliminar(7L))
                .isInstanceOf(ProveedorNotFoundException.class);
    }
}
