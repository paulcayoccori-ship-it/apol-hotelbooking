# 🏨 HotelBooking — Plataforma Distribuida de Gestión de Reservas Hoteleras

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=spring" />
  <img src="https://img.shields.io/badge/Angular-17-red?style=flat-square&logo=angular" />
  <img src="https://img.shields.io/badge/Docker-Compose-blue?style=flat-square&logo=docker" />
  <img src="https://img.shields.io/badge/Keycloak-Auth-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/MySQL-5-blue?style=flat-square&logo=mysql" />
  <img src="https://img.shields.io/badge/Prometheus-Grafana-yellow?style=flat-square" />
</p>

---

## 📋 Descripción del Proyecto

**HotelBooking** es una plataforma web distribuida para la gestión integral de reservas hoteleras, desarrollada con arquitectura de microservicios. Permite a los clientes visualizar habitaciones disponibles, revisar promociones, registrarse, autenticarse, realizar reservas y simular pagos mediante múltiples métodos (tarjeta, Yape, Plin, transferencia o efectivo). Adicionalmente, cuenta con un panel de administración completo para la gestión de habitaciones, usuarios, reservas, pagos y notificaciones.

El sistema aplica principios de **Ingeniería de Software** y **Arquitectura Cloud-Native**, integrando herramientas de observabilidad, seguridad basada en tokens y orquestación de contenedores.

---

## 🎯 Objetivo General

Diseñar e implementar una plataforma distribuida de gestión hotelera que aplique los principios de la arquitectura de microservicios, garantizando alta cohesión, bajo acoplamiento, escalabilidad horizontal y trazabilidad del sistema mediante herramientas de observabilidad, todo bajo un enfoque de buenas prácticas de Ingeniería de Software.

### Objetivos Específicos

- Implementar una arquitectura de microservicios con Spring Boot y Spring Cloud.
- Gestionar la configuración centralizada mediante Spring Cloud Config Server.
- Implementar descubrimiento de servicios con Eureka Registry.
- Centralizar el enrutamiento mediante Spring Cloud Gateway.
- Implementar autenticación y autorización con Keycloak (OAuth2 / OpenID Connect).
- Monitorear el sistema con Prometheus y Grafana.
- Proveer una interfaz de usuario moderna y responsive con Angular.
- Contenerizar todos los servicios con Docker y Docker Compose.

---

## 🔬 Relación con la Línea de Ingeniería de Software

Este proyecto aplica directamente los siguientes temas de la línea de Ingeniería de Software:

| Tema | Aplicación en el proyecto |
|---|---|
| Arquitectura de Microservicios | Sistema dividido en 5 microservicios independientes |
| Patrones de diseño | Repository, DTO, Service Layer, API Gateway |
| Principios SOLID | Aplicados en cada microservicio |
| API RESTful | Cada microservicio expone endpoints REST documentados |
| Comunicación entre servicios | RestTemplate / FeignClient entre microservicios |
| Manejo de errores | Respuestas estandarizadas y manejo de excepciones |
| Control de versiones | Git + GitHub con rama `main` y convención Conventional Commits |
| Autenticación y autorización | OAuth2 con Keycloak como Identity Provider |
| Testing | Pruebas funcionales mediante endpoints REST |

---

## 🖥️ Relación con la Línea de Infraestructura Tecnológica

| Tema | Aplicación en el proyecto |
|---|---|
| Contenerización | Docker y Docker Compose para todos los servicios |
| Orquestación de servicios | `docker-compose-dev.yml` levanta bases de datos y Keycloak |
| Configuración centralizada | Spring Cloud Config Server con repositorio local de configs |
| Descubrimiento de servicios | Eureka Server para registro dinámico |
| API Gateway | Spring Cloud Gateway como punto único de entrada |
| Observabilidad | Prometheus (métricas), Grafana (dashboards), Loki + Promtail (logs) |
| Bases de datos distribuidas | Una instancia MySQL por microservicio (aislamiento de datos) |
| Redes Docker | Red `hotelbooking-net` compartida entre contenedores |

---

## 👤 Funcionalidades del Cliente

El cliente accede a la plataforma mediante el portal público en `http://localhost:4200`.

- **Página de inicio:** Visualiza habitaciones disponibles y promociones activas.
- **Catálogo de habitaciones:** Lista con filtros por tipo (SINGLE, DOUBLE, SUITE, FAMILIAR).
- **Promociones:** Visualiza descuentos especiales con precio reducido.
- **Registro de cuenta:** Formulario con nombre, tipo de documento, número de documento, contraseña, teléfono y correo.
- **Inicio de sesión:** Autenticación con número de documento y contraseña.
- **Reserva de habitación:** Selección de fechas de entrada y salida con cálculo de precio total.
- **Pago de reserva:** Soporte para tarjeta, Yape, Plin, transferencia bancaria y efectivo.
- **Historial de reservas:** Visualización del estado de sus reservas (CONFIRMADA, PENDIENTE, CANCELADA).

---

## 🛠️ Funcionalidades del Administrador

El administrador accede al panel mediante `http://localhost:4200/login` (requiere cuenta Keycloak con rol `ADMIN`).

- **Dashboard:** Vista general del sistema.
- **Gestión de habitaciones:** CRUD completo con tipo, capacidad, precio, descripción e imagen.
- **Gestión de usuarios:** Listado, visualización y gestión de cuentas de clientes.
- **Gestión de reservas:** Listado de todas las reservas con filtros de estado.
- **Gestión de pagos:** Historial de pagos por método y estado.
- **Gestión de promociones:** Crear y administrar descuentos sobre habitaciones.
- **Gestión de notificaciones:** Visualización de notificaciones generadas por el sistema.

---

## 🏗️ Arquitectura del Sistema

El sistema sigue una arquitectura de **microservicios con infraestructura Spring Cloud**, organizada en las siguientes capas:

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Angular)                       │
│                   http://localhost:4200                      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│               API GATEWAY (Puerto 7091)                      │
│           Spring Cloud Gateway — enrutamiento                │
└──┬──────────┬──────────┬──────────┬──────────┬─────────────┘
   │          │          │          │          │
┌──▼──┐  ┌───▼──┐  ┌────▼──┐  ┌───▼──┐  ┌───▼──────────────┐
│8081 │  │ 8082 │  │  8083 │  │ 8084 │  │       8085        │
│USER │  │ ROOM │  │BOOKING│  │ PAY  │  │   NOTIFICATION    │
└──┬──┘  └───┬──┘  └────┬──┘  └───┬──┘  └───┬──────────────┘
   │         │           │         │          │
┌──▼─┐   ┌──▼─┐    ┌────▼┐   ┌───▼┐    ┌───▼┐
│3307│   │3308│    │3309 │   │3310│    │3311│
│MySQL   │MySQL│   │MySQL│   │MySQL│   │MySQL│
└────┘   └────┘   └─────┘   └────┘   └────┘

┌─────────────────────────────────────────────────────────────┐
│              INFRAESTRUCTURA DE SOPORTE                      │
│  Config Server (7071) │ Eureka Registry (7081)              │
│  Keycloak (8180)      │ Prometheus (9090) │ Grafana (3000)  │
└─────────────────────────────────────────────────────────────┘
```

**Flujo de comunicación:**
1. El cliente Angular se comunica exclusivamente con el **API Gateway**.
2. El Gateway enruta las peticiones a los microservicios correspondientes.
3. Cada microservicio consulta su propia base de datos MySQL.
4. Los microservicios se registran automáticamente en **Eureka** al arrancar.
5. La configuración de cada microservicio se obtiene desde **Config Server**.

---

## ⚙️ Microservicios del Sistema

| Microservicio | Puerto | Base de Datos | Responsabilidad |
|---|---|---|---|
| `ms-user-service` | 8081 | db_hotel_user (3307) | Registro, login y gestión de clientes |
| `ms-room-service` | 8082 | db_hotel_room (3308) | CRUD de habitaciones y promociones |
| `ms-booking-service` | 8083 | db_hotel_booking (3309) | Creación y gestión de reservas |
| `ms-payment-service` | 8084 | db_hotel_payment (3310) | Procesamiento y registro de pagos |
| `ms-notification-service` | 8085 | db_hotel_notification (3311) | Generación de notificaciones |

### Infraestructura de soporte

| Componente | Puerto | Descripción |
|---|---|---|
| `config-server` | 7071 | Centraliza la configuración de todos los servicios |
| `registry-server` | 7081 | Eureka: descubrimiento dinámico de microservicios |
| `gateway` | 7091 | Punto único de entrada y enrutamiento |
| `keycloak` | 8180 | Servidor de autenticación OAuth2 / OpenID Connect |
| `prometheus` | 9090 | Recolección de métricas de los microservicios |
| `grafana` | 3000 | Visualización de dashboards y alertas |
| `loki` | — | Agregación de logs del sistema |
| `promtail` | — | Recolector de logs hacia Loki |

---

## 🔄 Flujo General de Reserva

```
Cliente                    Sistema
  │                           │
  ├──[1] Visualiza habitaciones ──► ms-room-service
  │                           │
  ├──[2] Se registra/login ───► ms-user-service
  │                           │
  ├──[3] Selecciona habitación │
  │      y fechas              │
  │                           │
  ├──[4] Crea reserva ────────► ms-booking-service
  │                           │     │
  │                           │     └──► ms-notification-service
  │                           │              (genera notificación)
  ├──[5] Elige método de pago │
  │                           │
  └──[6] Confirma pago ───────► ms-payment-service
                              │     │
                              │     └──► ms-notification-service
                                            (confirma pago)
```

---

## 🔐 Seguridad con Keycloak

El sistema utiliza **Keycloak** como servidor de identidad (Identity Provider) implementando el estándar **OAuth2 / OpenID Connect**.

### Configuración del Realm

| Parámetro | Valor |
|---|---|
| Realm | `hotelbooking` |
| Client ID | `hotelbooking-web` |
| Client Authentication | OFF (public client) |
| Standard Flow | Habilitado |
| Valid Redirect URIs | `http://localhost:4200/*` |
| Web Origins | `http://localhost:4200` |

### Roles del sistema

| Rol | Descripción |
|---|---|
| `ADMIN` | Acceso completo al panel de administración |
| `CLIENT` | Acceso al portal de reservas de clientes |

### Flujo de autenticación

1. El cliente Angular solicita token a Keycloak con sus credenciales.
2. Keycloak valida y emite un **JWT (JSON Web Token)**.
3. El frontend incluye el token en el header `Authorization: Bearer <token>` en cada petición.
4. El API Gateway valida el token antes de enrutar la petición.

---

## 📊 Observabilidad con Prometheus y Grafana

El sistema implementa observabilidad completa mediante el stack **Prometheus + Grafana + Loki + Promtail**.

### Métricas disponibles

Cada microservicio Spring Boot expone el endpoint `/actuator/health` y métricas Prometheus en `/actuator/prometheus`. Las métricas incluyen:

- **JVM:** uso de memoria heap/non-heap, garbage collection, hilos activos.
- **HTTP:** número de peticiones, latencia, códigos de respuesta.
- **Base de datos:** tiempo de respuesta de conexiones, pool de conexiones.
- **Eureka:** estado del registro en el servidor de descubrimiento.

### Acceso a la observabilidad

| Herramienta | URL | Descripción |
|---|---|---|
| Prometheus | `http://localhost:9090/targets` | Estado de los targets scrapeados |
| Grafana | `http://localhost:3000` | Dashboards de métricas y logs |
| Actuator Health | `http://localhost:8081/actuator/health` | Salud individual de cada servicio |

---

## 🧰 Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Java | 17 LTS | Lenguaje principal del backend |
| Spring Boot | 3.x | Framework de microservicios |
| Spring Cloud Config | 4.x | Configuración centralizada |
| Spring Cloud Netflix Eureka | 4.x | Descubrimiento de servicios |
| Spring Cloud Gateway | 4.x | API Gateway reactivo |
| Spring Data JPA | 3.x | Persistencia y ORM |
| Spring Security | 6.x | Seguridad y OAuth2 |
| Maven | 3.9 | Gestión de dependencias |

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 17+ | Framework SPA |
| TypeScript | 5.x | Lenguaje del frontend |
| SCSS | — | Estilos del proyecto |
| Angular Reactive Forms | — | Formularios con validación |
| Angular Router | — | Navegación SPA |

### Infraestructura y DevOps

| Tecnología | Uso |
|---|---|
| Docker | Contenerización de servicios |
| Docker Compose | Orquestación en entorno de desarrollo |
| MySQL 8 | Base de datos relacional (una por microservicio) |
| Keycloak | Identity Provider (OAuth2 / OpenID Connect) |
| Prometheus | Recolección de métricas |
| Grafana | Visualización de dashboards |
| Loki | Agregación de logs |
| Promtail | Recolector de logs |
| GitHub | Control de versiones y repositorio remoto |

---

## 📁 Estructura del Proyecto

```
apol-hotelbooking/
│
├── clients/
│   └── hotelbooking-web/              # Frontend Angular (SPA)
│       ├── src/app/
│       │   ├── core/                  # Servicios, guards, interceptores
│       │   ├── layout/                # Header, Sidebar, Public Layout
│       │   └── pages/                 # Páginas: home, login, register, booking...
│       └── package.json
│
├── infra/
│   ├── config-server/                 # Spring Cloud Config Server (Puerto 7071)
│   ├── config-repo/                   # Archivos .yml de configuración por servicio
│   ├── gateway/                       # API Gateway (Puerto 7091)
│   └── registry-server/              # Eureka Server (Puerto 7081)
│
├── services/
│   ├── ms-user-service/              # Microservicio de usuarios (Puerto 8081)
│   ├── ms-room-service/              # Microservicio de habitaciones (Puerto 8082)
│   ├── ms-booking-service/           # Microservicio de reservas (Puerto 8083)
│   ├── ms-payment-service/           # Microservicio de pagos (Puerto 8084)
│   └── ms-notification-service/      # Microservicio de notificaciones (Puerto 8085)
│
├── observability/
│   ├── prometheus/                    # Configuración de scraping
│   ├── grafana/                       # Dashboards y datasources
│   ├── loki/                          # Configuración de agregación de logs
│   ├── promtail/                      # Recolector de logs
│   └── docker-compose.yml
│
├── docker-compose-dev.yml             # Levanta MySQL x5 + Keycloak
├── run-service.ps1                    # Script PowerShell de arranque
└── README.md
```

---

## 🚀 Cómo Levantar el Proyecto

### Pre-requisitos

Asegúrate de tener instalado:

| Herramienta | Versión mínima |
|---|---|
| Java JDK | 17 |
| Apache Maven | 3.9 |
| Node.js | 18+ |
| npm | 9+ |
| Docker Desktop | 24+ |
| Git | 2.x |

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/paulcayoccori-ship-it/apol-hotelbooking.git
cd apol-hotelbooking
```

### Paso 2 — Levantar infraestructura Docker (MySQL + Keycloak)

```bash
docker compose -f docker-compose-dev.yml up -d
docker ps
```

Los siguientes contenedores deben estar en estado `Up`:
- `mysql-user` (3307), `mysql-room` (3308), `mysql-booking` (3309)
- `mysql-payment` (3310), `mysql-notification` (3311)
- `keycloak` (8180)

### Paso 3 — Levantar Config Server

```bash
cd infra/config-server
mvn spring-boot:run
```

Verificar: `http://localhost:7071/ms-room-service/dev` → debe responder JSON con la configuración.

### Paso 4 — Levantar Eureka Registry

```bash
cd infra/registry-server
mvn spring-boot:run
```

Verificar: `http://localhost:7081` → debe mostrar el dashboard de Eureka.

### Paso 5 — Levantar los microservicios

En terminales separadas:

```bash
# Terminal 1
cd services/ms-user-service && mvn spring-boot:run

# Terminal 2
cd services/ms-room-service && mvn spring-boot:run

# Terminal 3
cd services/ms-booking-service && mvn spring-boot:run

# Terminal 4
cd services/ms-payment-service && mvn spring-boot:run

# Terminal 5
cd services/ms-notification-service && mvn spring-boot:run
```

### Paso 6 — Levantar el API Gateway

```bash
cd infra/gateway
mvn spring-boot:run
```

Verificar: `http://localhost:7091/actuator/health` → `{"status":"UP"}`

### Paso 7 — Levantar el Frontend Angular

```bash
cd clients/hotelbooking-web
npm install
npm start
```

Verificar: `http://localhost:4200` → Portal de clientes.

### Paso 8 — Levantar observabilidad

```bash
cd observability
docker compose -f docker-compose.yml up -d
```

---

## 🌐 URLs Principales

| Servicio | URL | Descripción |
|---|---|---|
| Portal cliente | `http://localhost:4200` | Página principal |
| Habitaciones | `http://localhost:4200/rooms` | Catálogo de habitaciones |
| Promociones | `http://localhost:4200/promotions` | Promociones activas |
| Login cliente | `http://localhost:4200/client-login` | Login del cliente |
| Registro | `http://localhost:4200/client-register` | Registro de nuevo cliente |
| Login admin | `http://localhost:4200/login` | Acceso al panel admin |
| Eureka Dashboard | `http://localhost:7081` | Estado de microservicios |
| Config Server | `http://localhost:7071/ms-room-service/dev` | Configuración por servicio |
| Gateway Health | `http://localhost:7091/actuator/health` | Estado del gateway |
| Keycloak | `http://localhost:8180` | Consola de administración |
| Prometheus | `http://localhost:9090/targets` | Targets de métricas |
| Grafana | `http://localhost:3000` | Dashboards de observabilidad |

---

## ✅ Pruebas Recomendadas

### Flujo de cliente

1. Abrir `http://localhost:4200` y verificar habitaciones en el home.
2. Ir a `http://localhost:4200/rooms` y filtrar por tipo.
3. Registrar un nuevo cliente en `http://localhost:4200/client-register`.
4. Iniciar sesión en `http://localhost:4200/client-login`.
5. Hacer clic en **Reservar ahora** en una habitación disponible.
6. Seleccionar fechas y confirmar la reserva.
7. Elegir método de pago y confirmar el pago.

### Verificación de Eureka

Abrir `http://localhost:7081` y confirmar que aparecen registrados:

- `GATEWAY`
- `MS-USER-SERVICE`
- `MS-ROOM-SERVICE`
- `MS-BOOKING-SERVICE`
- `MS-PAYMENT-SERVICE`
- `MS-NOTIFICATION-SERVICE`

### Verificación de salud de microservicios

```bash
curl http://localhost:8081/actuator/health  # user
curl http://localhost:8082/actuator/health  # room
curl http://localhost:8083/actuator/health  # booking
curl http://localhost:8084/actuator/health  # payment
curl http://localhost:8085/actuator/health  # notification
curl http://localhost:7091/actuator/health  # gateway
```

Todos deben responder: `{"status":"UP"}`

### Panel de administrador

1. Acceder a `http://localhost:8180` y verificar el realm `hotelbooking`.
2. Crear usuario admin con rol `ADMIN` en Keycloak.
3. Iniciar sesión en `http://localhost:4200/login`.
4. Verificar CRUD de habitaciones, reservas y pagos.

---

## 🖼️ Evidencias del Proyecto

### Portal público — Página de inicio

> Visualización de habitaciones disponibles, sección de beneficios y footer con acceso administrador.

### Login de cliente

> Formulario de autenticación con diseño moderno, división de panel decorativo y toggle de contraseña.

### Registro de cliente

> Formulario de registro con campos validados: nombre, tipo de documento, contraseña y datos opcionales.

### Panel de administración

> Dashboard con sidebar de navegación para gestionar habitaciones, reservas, pagos, usuarios, promociones y notificaciones.

### Eureka Dashboard

> `http://localhost:7081` mostrando todos los microservicios registrados y su estado `UP`.

### Prometheus Targets

> `http://localhost:9090/targets` mostrando los endpoints scrapeados de cada microservicio.

### Grafana Dashboard

> `http://localhost:3000` con dashboards de métricas JVM, HTTP y base de datos.

---

## 🏷️ Topics Sugeridos para GitHub

```
microservices  spring-boot  spring-cloud  angular  docker
java  keycloak  eureka  api-gateway  mysql  prometheus
grafana  rest-api  oauth2  hotel-management  typescript
academic-project  distributed-systems  config-server
```

---

## 👥 Integrantes

| N° | Apellidos y Nombres | Código |
|---|---|---|
| 01 | Cayoccori Paucar, Paul | — |

> *Proyecto desarrollado como parte del curso de Ingeniería de Software y Arquitectura de Microservicios.*

---

## 📚 Curso

**Nombre del curso:** Arquitectura de Software / Ingeniería de Software II

**Escuela Profesional:** Ingeniería de Sistemas e Informática

**Universidad:** Universidad Nacional — Sede Lima, Perú

**Ciclo académico:** 2025 - I

---

## 📝 Notas Técnicas

- **Base de datos:** Cada microservicio tiene su propio esquema MySQL (principio de *Database per Service*).
- **Configuración:** Los archivos `.yml` por servicio se alojan en `infra/config-repo/` y son servidos por el Config Server.
- **Sin Kafka:** La comunicación entre microservicios se realiza mediante llamadas REST síncronas.
- **Entorno:** El proyecto está configurado para el perfil `dev`. No requiere configuración adicional para levantar en local.

---

<p align="center">
  Desarrollado con ❤️ como proyecto académico — HotelBooking © 2024-2025
</p>
