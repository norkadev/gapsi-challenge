# API de Proveedores

API REST construida con Java 21 y Spring Boot 4 para consultar, registrar y eliminar proveedores. En desarrollo usa H2 en memoria; los 40 registros de ejemplo se cargan solo con el perfil `dev` y se pierden al reiniciar.

## Requisitos

- Java 21 (JDK)

## Clonar, compilar y ejecutar

```shell
git clone https://github.com/norkadev/gapsi-challenge.git
cd gapsi-challenge/proveedores
./mvnw clean verify
./mvnw spring-boot:run
```

En Windows: `.\mvnw.cmd clean verify` y `.\mvnw.cmd spring-boot:run`. La API inicia en `http://localhost:8080`. Para cambiar el origen CORS permitido, configura `PROVEEDORES_UI_ORIGIN` (por defecto `http://localhost:5173`).

## Documentación

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Especificación OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Colección de Postman: `postman/proveedores.postman_collection.json`. Impórtala en Postman; usa la variable `baseUrl` (`http://localhost:8080`).

## Endpoints

Ordenamiento permitido en el listado: nombre, razonSocial, direccion

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api/v1/welcome` | `200`, mensaje de bienvenida |
| `GET` | `/api/v1/version` | `200`, versión de la aplicación |
| `GET` | `/api/v1/proveedores?page=0&size=20` | `200`, página de proveedores |
| `GET` | `/api/v1/proveedores/{id}` | `200`, proveedor encontrado; `404` si no existe |
| `POST` | `/api/v1/proveedores` | `201` y encabezado `Location`; `409` si el nombre ya existe |
| `DELETE` | `/api/v1/proveedores/{id}` | `204`; `404` si no existe |

El cuerpo de creación y cada elemento de `content` usan esta forma:

```json
{
  "id": 1,
  "nombre": "Suministros del Centro",
  "razonSocial": "Suministros del Centro S.A. de C.V.",
  "direccion": "Av. Reforma 100, Ciudad de México"
}
```

Para crear un proveedor, `id` no se envía:

```json
{
  "nombre": "Suministros del Centro",
  "razonSocial": "Suministros del Centro S.A. de C.V.",
  "direccion": "Av. Reforma 100, Ciudad de México"
}
```

La respuesta paginada es un `Page` de Spring Data con `content` (arreglo de los objetos anteriores), `pageable`, `totalElements`, `totalPages`, `size`, `number`, `first`, `last` y metadatos de paginación. Los errores usan `ProblemDetail` (RFC 9457); para validaciones, incluyen `errors`, un objeto con el nombre del campo y su mensaje.

## Patrones de diseño

| Patrón | Archivo |
|---|---|
| Repository | `proveedor/ProveedorRepository.java` |
| DTO | `proveedor/dto/` |
