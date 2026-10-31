package com.gapsi.proveedores.proveedor;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.gapsi.proveedores.common.config.AppProperties;
import com.gapsi.proveedores.info.InfoController;
import com.gapsi.proveedores.proveedor.dto.ProveedorRequest;
import com.gapsi.proveedores.proveedor.dto.ProveedorResponse;

/**
 * Web contract tests for supplier and application information endpoints.
 */
@WebMvcTest(controllers = { ProveedorController.class, InfoController.class })
@Import(ProveedorControllerTest.PropertiesConfiguration.class)
class ProveedorControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private ProveedorService proveedorService;

        @Test
        void welcome_sinParametros_devuelveMensaje() throws Exception {
                mockMvc.perform(get("/api/v1/welcome"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.message").value("Bienvenido Candidato 01"));
        }

        @Test
        void version_sinParametros_devuelveVersionConfigurada() throws Exception {
                mockMvc.perform(get("/api/v1/version"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.version").value("0.0.1-SNAPSHOT"));
        }

        @Test
        void listar_conPaginaSolicitada_devuelveProveedoresPaginados() throws Exception {
                ProveedorResponse response = new ProveedorResponse(
                                1L, "Proveedor Uno", "Proveedor Uno S.A. de C.V.", "Calle Principal 1");
                when(proveedorService.listar(any())).thenReturn(
                                new PageImpl<>(List.of(response), PageRequest.of(0, 20), 1));

                mockMvc.perform(get("/api/v1/proveedores?page=0&size=20"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.content[0].id").value(1))
                                .andExpect(jsonPath("$.content[0].nombre").value("Proveedor Uno"))
                                .andExpect(jsonPath("$.totalElements").value(1));
        }

        @Test
        void listar_conCampoDeOrdenNoPermitido_devuelve400() throws Exception {
                mockMvc.perform(get("/api/v1/proveedores?sort=string"))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.title").value("Ordenamiento inválido"))
                                .andExpect(jsonPath("$.detail").value(
                                                "El campo de orden 'string' no es válido. "
                                                                + "Campos permitidos: nombre, razonSocial y direccion."));
        }

        @Test
        void buscarPorId_proveedorExistente_devuelveProveedor() throws Exception {
                when(proveedorService.buscarPorId(7L)).thenReturn(new ProveedorResponse(
                                7L, "Proveedor Uno", "Proveedor Uno S.A. de C.V.", "Calle Principal 1"));

                mockMvc.perform(get("/api/v1/proveedores/7"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(7))
                                .andExpect(jsonPath("$.nombre").value("Proveedor Uno"))
                                .andExpect(jsonPath("$.razonSocial").value("Proveedor Uno S.A. de C.V."))
                                .andExpect(jsonPath("$.direccion").value("Calle Principal 1"));
        }

        @Test
        void buscarPorId_proveedorInexistente_devuelve404() throws Exception {
                when(proveedorService.buscarPorId(99L))
                                .thenThrow(new ProveedorNotFoundException(99L));

                mockMvc.perform(get("/api/v1/proveedores/99"))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.title").value("Proveedor no encontrado"));
        }

        @Test
        void crear_datosValidos_devuelve201ConLocationYCuerpo() throws Exception {
                ProveedorResponse response = new ProveedorResponse(
                                7L, "Proveedor Nuevo", "Proveedor Nuevo S.A. de C.V.", "Av. Central 7");
                when(proveedorService.crear(any(ProveedorRequest.class))).thenReturn(response);

                mockMvc.perform(post("/api/v1/proveedores")
                                .contentType("application/json")
                                .content("""
                                                {
                                                  "nombre": "Proveedor Nuevo",
                                                  "razonSocial": "Proveedor Nuevo S.A. de C.V.",
                                                  "direccion": "Av. Central 7"
                                                }
                                                """))
                                .andExpect(status().isCreated())
                                .andExpect(header().string("Location", "http://localhost/api/v1/proveedores/7"))
                                .andExpect(jsonPath("$.id").value(7))
                                .andExpect(jsonPath("$.razonSocial").value("Proveedor Nuevo S.A. de C.V."));
        }

        @Test
        void crear_nombreExistente_devuelve409() throws Exception {
                when(proveedorService.crear(any(ProveedorRequest.class)))
                                .thenThrow(new ProveedorDuplicadoException("Proveedor Existente"));

                mockMvc.perform(post("/api/v1/proveedores")
                                .contentType("application/json")
                                .content("""
                                                {
                                                  "nombre": "Proveedor Existente",
                                                  "razonSocial": "Proveedor Existente S.A. de C.V.",
                                                  "direccion": "Av. Central 7"
                                                }
                                                """))
                                .andExpect(status().isConflict())
                                .andExpect(jsonPath("$.title").value("Proveedor duplicado"));
        }

        @Test
        void crear_datosInvalidos_devuelve400ConErroresPorCampo() throws Exception {
                mockMvc.perform(post("/api/v1/proveedores")
                                .contentType("application/json")
                                .content("""
                                                {
                                                  "nombre": " ",
                                                  "razonSocial": "Proveedor S.A. de C.V.",
                                                  "direccion": "Av. Central 7"
                                                }
                                                """))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.nombre").exists());
        }

        @Test
        void eliminar_proveedorExistente_devuelve204() throws Exception {
                mockMvc.perform(delete("/api/v1/proveedores/7"))
                                .andExpect(status().isNoContent());
        }

        @Test
        void eliminar_proveedorInexistente_devuelve404() throws Exception {
                doThrow(new ProveedorNotFoundException(7L))
                                .when(proveedorService).eliminar(7L);

                mockMvc.perform(delete("/api/v1/proveedores/7"))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.title").value("Proveedor no encontrado"));
        }

        @TestConfiguration(proxyBeanMethods = false)
        static class PropertiesConfiguration {

                @Bean
                AppProperties appProperties() {
                        return new AppProperties("0.0.1-SNAPSHOT", "Bienvenido Candidato 01",
                                        new AppProperties.Cors("http://localhost:5173"));
                }
        }
}
