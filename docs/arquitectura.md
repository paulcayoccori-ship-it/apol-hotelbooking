# Arquitectura del Sistema

## Visión general

HotelBooking implementa una **arquitectura de microservicios** con infraestructura Spring Cloud. El sistema está compuesto por servicios independientes que se comunican a través del **API Gateway**, se registran en **Eureka** y obtienen su configuración desde el **Config Server**.

---

## Diagrama de arquitectura

```
┌──────────────────────────────────────────────────────────────────┐
│                    CLIENTE (Angular)                              │
│               http://localhost:4200                               │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTP
┌──────────────────────▼───────────────────────────────────────────┐
│               API GATEWAY — Puerto 7091                           │
│           Spring Cloud Gateway (enrutamiento + JWT)               │
└───┬─────────┬──────────┬──────────┬──────────┬───────────────────┘
    │         │          │          │          │
┌───▼──┐ ┌───▼──┐  ┌────▼──┐  ┌───▼──┐  ┌───▼───────────────────┐
│ 8081 │ │ 8082 │  │  8083 │  │ 8084 │  │         8085           │
│ USER │ │ ROOM │  │BOOKING│  │ PAY  │  │    NOTIFICATION        │
└──┬───┘ └──┬───┘  └───┬───┘  └──┬───┘  └──┬────────────────────┘
   │        │          │         │          │
┌──▼─┐  ┌──▼─┐  ┌─────▼┐  ┌────▼┐  ┌─────▼┐
│3307│  │3308│  │ 3309 │  │3310 │  │ 3311 │
│MySQL  │MySQL  │ MySQL │  │MySQL│  │MySQL │
└────┘  └────┘  └──────┘  └─────┘  └──────┘

┌──────────────────────────────────────────────────────────────────┐
│                 INFRAESTRUCTURA DE SOPORTE                        │
│                                                                   │
│  Config Server (7071)  │  Eureka Registry (7081)                  │
│  Keycloak (8180)       │  Prometheus (9090) │ Grafana (3000)      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Responsabilidad de cada servicio

### Microservicios de negocio

| Servicio | Puerto | Base de datos | Responsabilidad |
|---|---|---|---|
| `ms-user-service` | 8081 | db_hotel_user (3307) | Registro, autenticación y gestión de clientes |
| `ms-room-service` | 8082 | db_hotel_room (3308) | CRUD de habitaciones y gestión de promociones |
| `ms-booking-service` | 8083 | db_hotel_booking (3309) | Creación y gestión del ciclo de vida de reservas |
| `ms-payment-service` | 8084 | db_hotel_payment (3310) | Procesamiento y registro de pagos |
| `ms-notification-service` | 8085 | db_hotel_notification (3311) | Generación de notificaciones del sistema |

### Infraestructura de soporte

| Componente | Puerto | Descripción |
|---|---|---|
| `config-server` | 7071 | Centraliza la configuración de todos los servicios |
| `registry-server` | 7081 | Eureka: descubrimiento dinámico de microservicios |
| `gateway` | 7091 | Punto único de entrada, enrutamiento y validación JWT |
| `keycloak` | 8180 | Identity Provider — OAuth2 / OpenID Connect |
| `prometheus` | 9090 | Recolección de métricas de los microservicios |
| `grafana` | 3000 | Visualización de dashboards y alertas |

---

## Comunicación entre servicios

### Principio fundamental

Todos los clientes externos (Angular) se comunican **únicamente con el API Gateway**. El Gateway resuelve el microservicio destino consultando el **registro de Eureka**.

```
Cliente Angular
    │
    ▼
API Gateway (7091)  ─── consulta ───► Eureka (7081)
    │                                      │
    │  ◄── "ms-booking-service en 8083" ───┘
    │
    ▼
ms-booking-service (8083)
    │
    ▼
MySQL booking (3309)
```

### Comunicación entre microservicios

Los microservicios pueden comunicarse entre sí mediante llamadas REST internas. Por ejemplo:

- `ms-booking-service` puede llamar a `ms-notification-service` al confirmar una reserva.
- `ms-payment-service` puede llamar a `ms-notification-service` al completar un pago.

---

## Config Server

Cada microservicio obtiene su configuración al arrancar desde el Config Server:

```
ms-room-service arranca
    │
    ▼
Solicita: http://config-server:7071/ms-room-service/dev
    │
    ▼
Config Server devuelve: ms-room-service-dev.yml
    │
    └─► spring.datasource.url=jdbc:mysql://localhost:3308/db_hotel_room
        server.port=8082
        eureka.client.serviceUrl.defaultZone=http://localhost:7081/eureka/
```

---

## API Gateway — Enrutamiento

El Gateway define rutas que mapean prefijos de URL a microservicios:

| Prefijo URL | Microservicio destino |
|---|---|
| `/api/users/**` | ms-user-service |
| `/api/rooms/**` | ms-room-service |
| `/api/bookings/**` | ms-booking-service |
| `/api/payments/**` | ms-payment-service |
| `/api/notifications/**` | ms-notification-service |

---

## Principios de diseño aplicados

| Principio | Aplicación |
|---|---|
| **Database per Service** | Cada microservicio tiene su propia base de datos MySQL aislada |
| **Single Responsibility** | Cada microservicio resuelve un único dominio de negocio |
| **API Gateway Pattern** | Punto de entrada único para todos los clientes |
| **Service Registry** | Eureka registra y descubre servicios dinámicamente |
| **Externalized Configuration** | Config Server externaliza toda la configuración |
| **Observability** | Prometheus + Grafana monitorizan el sistema completo |
