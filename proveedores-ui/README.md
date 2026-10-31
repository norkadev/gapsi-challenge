# e-Commerce Gapsi

Frontend React + TypeScript para consultar y administrar proveedores mediante el backend Spring Boot de `../proveedores`.

## Requisitos

- Node.js compatible con la versión de Vite instalada.
- Backend iniciado en `http://localhost:8080`.

## Requisitos

- Node v26.12.1
- Backend iniciado en `http://localhost:8080` (ver `../proveedores`)

## Instalar y ejecutar

```shell
git clone https://github.com/norkadev/gapsi-challenge.git
cd gapsi-challenge/proveedores-ui
npm i
npm run dev
```

## Verificación

```shell
npm run build
npm run lint
```

## PWA

Se configuraron el manifest de instalación, iconos y un service worker que precachea los recursos estáticos compilados. Después de `npm run build`, ejecuta `npm run preview` y abre la aplicación en el navegador; el manifest y el service worker se pueden revisar desde DevTools → Application.

La fotografía del candidato y el logo de Gapsi se encuentran en `src/assets/`. El logo se utiliza en la cabecera, la bienvenida, el favicon y los iconos PWA.

## Estructura

- `src/features/welcome`: bienvenida y versión obtenidas del backend.
- `src/features/proveedores`: listado paginado con virtual scroll, alta, eliminación y estado de errores.
- `src/shared`: cliente HTTP, tema y cabecera reutilizables.

## Patrones de diseño

| Patrón    | Archivo                                      |
| --------- | -------------------------------------------- |
| Singleton | `src/shared/api/httpClient.ts`               |
| Facade    | `src/features/proveedores/proveedoresApi.ts` |

## Funcionalidad destacada

Listado con virtual scroll y carga paginada, validación de nombre duplicado (409), impresión de todos los proveedores sin la columna de acciones, UI con Material-UI y PWA instalable.
