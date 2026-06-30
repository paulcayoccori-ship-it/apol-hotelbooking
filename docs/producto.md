# Producto del Curso

## Nombre del producto

**HotelBooking** — Plataforma distribuida de gestión de reservas hoteleras.

---

## Problema que resuelve

Los sistemas de gestión hotelera tradicionales presentan limitaciones de escalabilidad, acoplamiento fuerte entre módulos y dificultad para crecer de forma independiente. HotelBooking resuelve este problema aplicando **arquitectura de microservicios**, donde cada módulo (usuarios, habitaciones, reservas, pagos, notificaciones) es un servicio autónomo con su propia base de datos.

---

## Público objetivo

| Rol | Descripción |
|---|---|
| **Cliente** | Usuario final que busca, reserva y paga habitaciones de hotel |
| **Administrador** | Gestiona habitaciones, usuarios, reservas, pagos y promociones |
| **Estudiante** | Aprende arquitectura distribuida implementando un sistema real |
| **Equipo técnico** | Mantiene y escala el sistema en producción |

---

## Funcionalidades principales

### Para el cliente

- Visualizar habitaciones disponibles con precio por noche.
- Revisar promociones y descuentos activos.
- Registrarse con nombre, tipo de documento y contraseña.
- Iniciar sesión con número de documento y contraseña.
- Reservar habitaciones seleccionando fechas de entrada y salida.
- Simular pagos con tarjeta, Yape, Plin, transferencia o efectivo.
- Consultar el estado de sus reservas.

### Para el administrador

- Acceder al panel con autenticación Keycloak (rol `ADMIN`).
- CRUD completo de habitaciones (tipo, capacidad, precio, imagen).
- Gestión de usuarios del sistema.
- Visualización y gestión de reservas.
- Registro y seguimiento de pagos.
- Administración de promociones.
- Consulta de notificaciones del sistema.

---

## Resultado esperado

!!! success "Producto U3"
    Sistema distribuido de microservicios **end-to-end**:

    - ✅ Configurable — Spring Cloud Config Server centraliza toda la configuración.
    - ✅ Escalable — Cada microservicio puede escalar de forma independiente.
    - ✅ Seguro — Keycloak gestiona autenticación y autorización con OAuth2.
    - ✅ Observable — Prometheus, Grafana y Loki monitorean el sistema en tiempo real.
    - ✅ Integrado con frontend — Angular consume el sistema vía API Gateway.
    - ✅ Sustentado técnicamente — Evidencias reales de ejecución disponibles.

---

## Stack tecnológico resumido

```
Frontend     → Angular 17 + TypeScript + SCSS
Backend      → Java 17 + Spring Boot 3 + Spring Cloud
Seguridad    → Keycloak (OAuth2 / OpenID Connect)
Base datos   → MySQL 8 (una instancia por microservicio)
Contenedores → Docker + Docker Compose
Observación  → Prometheus + Grafana + Loki + Promtail
Registro     → Eureka Server (Spring Cloud Netflix)
Config       → Spring Cloud Config Server
Gateway      → Spring Cloud Gateway
Control      → Git + GitHub + GitHub Actions
```
