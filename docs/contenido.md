# Contenido del Curso

## Índice de sesiones

El proyecto HotelBooking se desarrolla en tres unidades que progresan desde la infraestructura base hasta la validación completa del sistema distribuido.

---

## U1 — Infraestructura base orientada a producción

### Arquitectura base

- Definición de la arquitectura de microservicios.
- Separación de responsabilidades por servicio.
- Principio *Database per Service*: cada microservicio con su propia MySQL.
- Diseño del diagrama de componentes.

### Docker y contenedores

- Instalación y configuración de Docker Desktop.
- Creación de `docker-compose-dev.yml` para levantar MySQL x5 y Keycloak.
- Definición de redes Docker (`hotelbooking-net`).
- Uso de variables de entorno y volúmenes persistentes.

### Config Server

- Implementación de Spring Cloud Config Server.
- Repositorio local de configuraciones (`config-repo/`).
- Archivos `.yml` por microservicio y por perfil (`-dev.yml`).
- Verificación: `http://localhost:7071/ms-room-service/dev`.

### Eureka — Descubrimiento de servicios

- Implementación de Eureka Server con Spring Cloud Netflix.
- Registro automático de cada microservicio al arrancar.
- Dashboard de Eureka: `http://localhost:7081`.
- Configuración de `eureka.client.serviceUrl.defaultZone`.

### API Gateway

- Implementación de Spring Cloud Gateway.
- Definición de rutas por microservicio en `gateway-dev.yml`.
- Validación de tokens JWT desde Keycloak.
- Health check: `http://localhost:7091/actuator/health`.

---

## U2 — Sistema distribuido robusto

### Seguridad con Keycloak

- Configuración del realm `hotelbooking`.
- Creación del cliente público `hotelbooking-web`.
- Definición de roles: `ADMIN`, `CUSTOMER`.
- Integración OAuth2 con el frontend Angular.
- Protección de rutas en el Gateway con tokens JWT.

### Frontend Angular

- Creación del proyecto Angular standalone.
- Módulo público: home, habitaciones, promociones, login, registro.
- Panel administrador con sidebar y guards de autenticación.
- Consumo de la API vía Gateway (`http://localhost:7091`).
- Diseño responsive con SCSS y variables de color.

### Microservicio: Gestión de habitaciones

- Entidad `Room` con campos: número, tipo, capacidad, precio, imagen.
- CRUD completo con Spring Data JPA.
- Endpoints REST: `GET /rooms`, `POST /rooms`, `PUT /rooms/{id}`, `DELETE /rooms/{id}`.
- Gestión de promociones: descuento porcentual y precio final.

### Microservicio: Reservas

- Entidad `Booking` con fechas de entrada/salida, estado y precio total.
- Validación de disponibilidad al crear una reserva.
- Estados: `PENDING`, `CONFIRMED`, `CANCELLED`.
- Integración con notificaciones al confirmar la reserva.

### Microservicio: Pagos

- Entidad `Payment` con método de pago y estado.
- Métodos disponibles: tarjeta, Yape, Plin, transferencia, efectivo.
- Estados de pago: `PENDING`, `COMPLETED`, `FAILED`.
- Generación de notificación al completar el pago.

---

## U3 — Validación y consolidación

### Observabilidad con Prometheus

- Configuración de `prometheus.yml` con los targets de los microservicios.
- Endpoint `/actuator/prometheus` habilitado en cada microservicio.
- Verificación de targets en `http://localhost:9090/targets`.

### Dashboards con Grafana

- Configuración del datasource Prometheus en Grafana.
- Importación de dashboards JVM y HTTP.
- Métricas de: memoria, CPU, peticiones HTTP, latencia.
- Acceso: `http://localhost:3000`.

### Consolidación y evidencias

- Verificación completa del flujo: registro → reserva → pago.
- Evidencias de Eureka con todos los servicios registrados.
- Pruebas del panel administrador con datos reales.
- Captura de métricas en Prometheus y Grafana.

### Sustentación técnica

- Presentación de la arquitectura y decisiones de diseño.
- Demostración en vivo del sistema funcionando.
- Explicación del rol de cada componente.
- Defensa de las decisiones técnicas tomadas.
