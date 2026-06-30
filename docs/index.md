# HotelBooking — Sistemas Distribuidos

Proyecto práctico de **sistemas distribuidos con microservicios**, configuración centralizada, descubrimiento de servicios, Gateway, seguridad con Keycloak, observabilidad con Prometheus y Grafana, e integración con frontend Angular.

**HotelBooking** es un entorno integrado para construir un sistema de gestión hotelera mediante una arquitectura de microservicios basada en **Docker** y **Spring Cloud**. El proyecto unifica infraestructura, microservicios, cliente Angular, observabilidad e identidad con **Keycloak**.

---

## Producto del curso

!!! quote "Producto Final"
    **Sistema distribuido de microservicios end-to-end**, configurable, escalable, seguro, observable e integrado con frontend Angular, sustentado técnicamente con evidencias reales de ejecución.

[Ver definición completa del producto →](producto.md)

---

## Resultado esperado del curso

Al finalizar el proyecto, el estudiante **implementa, integra y sustenta** una solución distribuida basada en microservicios. La solución debe ejecutarse de forma reproducible en **desarrollo local**, exponer evidencias de configuración, registro, enrutamiento, seguridad, comunicación entre servicios, persistencia y observabilidad.

---

## Contenido

### U1 — Infraestructura base orientada a producción

Configuración del entorno distribuido: Docker, Config Server, Eureka y API Gateway como piezas fundamentales de la arquitectura.

### U2 — Sistema distribuido robusto

Integración de seguridad con Keycloak, frontend Angular y los microservicios de negocio: habitaciones, usuarios, reservas y pagos.

### U3 — Validación y consolidación

Observabilidad con Prometheus y Grafana, validación del flujo completo de reserva y sustentación con evidencias.

[Ver índice de contenido →](contenido.md)

---

## Arquitectura HotelBooking

HotelBooking implementa una arquitectura de **microservicios desacoplados**, donde cada servicio tiene su propia base de datos MySQL y se comunica a través del **API Gateway**. La configuración es centralizada en el **Config Server** y el descubrimiento de servicios se realiza con **Eureka**.

```
Angular (4200)
    │
    ▼
API Gateway (7091)
    │
    ├─► ms-user-service    (8081)  ──► MySQL (3307)
    ├─► ms-room-service    (8082)  ──► MySQL (3308)
    ├─► ms-booking-service (8083)  ──► MySQL (3309)
    ├─► ms-payment-service (8084)  ──► MySQL (3310)
    └─► ms-notification-service (8085) ──► MySQL (3311)

Soporte:
    Config Server (7071) │ Eureka (7081) │ Keycloak (8180)
    Prometheus (9090)    │ Grafana (3000)
```

[Ver arquitectura completa →](arquitectura.md)

---

## Flujo de trabajo

```
Cliente
  └─► Frontend Angular (4200)
        └─► API Gateway (7091)
              └─► Microservicio correspondiente
                    └─► Base de datos MySQL
```

1. El cliente accede al portal web en `http://localhost:4200`.
2. El frontend realiza llamadas al **API Gateway** en el puerto `7091`.
3. El Gateway enruta la petición al microservicio correcto registrado en **Eureka**.
4. El microservicio responde con los datos desde su propia base de datos.

[Ver flujo completo →](flujo-trabajo.md)

---

## Enlaces rápidos

| Servicio | URL |
|---|---|
| Portal cliente | [http://localhost:4200](http://localhost:4200) |
| Panel admin | [http://localhost:4200/login](http://localhost:4200/login) |
| Eureka Dashboard | [http://localhost:7081](http://localhost:7081) |
| Gateway Health | [http://localhost:7091/actuator/health](http://localhost:7091/actuator/health) |
| Keycloak | [http://localhost:8180](http://localhost:8180) |
| Prometheus | [http://localhost:9090](http://localhost:9090) |
| Grafana | [http://localhost:3000](http://localhost:3000) |

[Ver tabla completa de puertos →](puertos.md)
