# Gapsi e-Commerce – Mantenimiento de proveedores

Solución de la prueba técnica: API REST en Java/Spring Boot y SPA en React.

```
gapsi-challenge/
├── proveedores/      Backend (Java 21, Spring Boot 4, H2) → ver su README
└── proveedores-ui/   Frontend (React, TypeScript, MUI, PWA) → ver su README
```

## Cómo levantarlo (en este orden)

Requisitos: Java 21 y Node v26.12.1

1. Backend: `cd proveedores` y `./mvnw spring-boot:run` (http://localhost:8080).
2. Frontend: `cd proveedores-ui`, `npm i` y `npm run dev` (http://localhost:5173).

## Documentación de la API

- Swagger UI: http://localhost:8080/swagger-ui.html
- Colección de Postman: `proveedores/postman/proveedores.postman_collection.json`

## Patrones de diseño

- Backend: Repository, DTO (ver README del backend).
- Frontend: Singleton y Facade (ver README del frontend).

## PWA

Manifest y service worker con precaché. Se verifica con `npm run build` y `npm run preview` en `proveedores-ui`.
