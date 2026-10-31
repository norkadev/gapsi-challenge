package com.gapsi.proveedores.proveedor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gapsi.proveedores.proveedor.dto.ProveedorRequest;
import com.gapsi.proveedores.proveedor.dto.ProveedorResponse;

/**
 * Coordinates supplier persistence and API data mapping.
 */
// Patrón de diseño: Service Layer
@Service
@Transactional(readOnly = true)
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    public Page<ProveedorResponse> listar(Pageable pageable) {
        return proveedorRepository.findAll(pageable).map(ProveedorService::toResponse);
    }

    public ProveedorResponse buscarPorId(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ProveedorNotFoundException(id));
        return toResponse(proveedor);
    }

    @Transactional
    public ProveedorResponse crear(ProveedorRequest request) {
        if (proveedorRepository.existsByNombre(request.nombre())) {
            throw new ProveedorDuplicadoException(request.nombre());
        }

        Proveedor proveedor = new Proveedor(
                request.nombre(),
                request.razonSocial(),
                request.direccion());
        return toResponse(proveedorRepository.save(proveedor));
    }

    @Transactional
    public void eliminar(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ProveedorNotFoundException(id));
        proveedorRepository.delete(proveedor);
    }

    private static ProveedorResponse toResponse(Proveedor proveedor) {
        return new ProveedorResponse(
                proveedor.getId(),
                proveedor.getNombre(),
                proveedor.getRazonSocial(),
                proveedor.getDireccion());
    }
}
