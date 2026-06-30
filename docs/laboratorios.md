# Laboratorios

## Índice de laboratorios

Laboratorios desarrollados durante el ciclo académico para construir el sistema HotelBooking de forma incremental.

---

## Lab 01 — Arquitectura base y Docker

**Objetivo:** Definir la arquitectura del sistema y levantar la infraestructura base con Docker.

**Actividades:**
- Diseñar el diagrama de arquitectura de microservicios.
- Identificar los 5 microservicios de negocio y sus responsabilidades.
- Crear el `docker-compose-dev.yml` con 5 instancias MySQL y Keycloak.
- Definir la red Docker `hotelbooking-net`.
- Verificar con `docker ps` que todos los contenedores levantan.

**Evidencia esperada:** Captura de `docker ps` con todos los contenedores en estado `Up`.

---

## Lab 02 — Configuración centralizada (Config Server)

**Objetivo:** Implementar Spring Cloud Config Server para centralizar la configuración de todos los microservicios.

**Actividades:**
- Crear el proyecto `config-server` con Spring Cloud Config.
- Crear el repositorio local `config-repo/` con archivos `.yml` por microservicio.
- Configurar los archivos: `ms-user-service-dev.yml`, `ms-room-service-dev.yml`, etc.
- Levantar el Config Server y verificar la respuesta.

**Evidencia esperada:** `GET http://localhost:7071/ms-room-service/dev` devuelve JSON con la configuración.

---

## Lab 03 — Registro y descubrimiento (Eureka)

**Objetivo:** Implementar Eureka Server para el descubrimiento dinámico de microservicios.

**Actividades:**
- Crear el proyecto `registry-server` con Spring Cloud Netflix Eureka.
- Configurar cada microservicio para registrarse en Eureka al arrancar.
- Verificar el registro en el dashboard de Eureka.
- Observar el registro/desregistro en tiempo real.

**Evidencia esperada:** Dashboard de Eureka en `http://localhost:7081` con los 5 microservicios y el Gateway registrados.

---

## Lab 04 — API Gateway

**Objetivo:** Implementar Spring Cloud Gateway como punto único de entrada al sistema.

**Actividades:**
- Crear el proyecto `gateway` con Spring Cloud Gateway.
- Definir rutas de enrutamiento por microservicio en `gateway-dev.yml`.
- Probar que las peticiones al Gateway son enrutadas correctamente.
- Verificar el health check del Gateway.

**Evidencia esperada:** `GET http://localhost:7091/actuator/health` responde `{"status":"UP"}`.

---

## Lab 05 — Microservicios de negocio

**Objetivo:** Implementar los 5 microservicios con Spring Boot y Spring Data JPA.

**Actividades:**
- Crear las entidades JPA: User, Room, Booking, Payment, Notification.
- Implementar los repositorios y servicios de cada entidad.
- Crear los controladores REST con los endpoints necesarios.
- Conectar cada microservicio a su base de datos MySQL.
- Verificar el health check de cada microservicio.

**Evidencia esperada:** Todos los endpoints responden correctamente a través del Gateway.

---

## Lab 06 — Integración Frontend Angular

**Objetivo:** Desarrollar la interfaz de usuario con Angular y conectarla al sistema de microservicios.

**Actividades:**
- Crear el proyecto Angular standalone.
- Implementar el módulo público: home, habitaciones, promociones.
- Implementar el módulo de autenticación: login y registro de cliente.
- Implementar el panel de administración con guards de ruta.
- Conectar todos los componentes al Gateway (`http://localhost:7091`).

**Evidencia esperada:** `http://localhost:4200` muestra habitaciones cargadas desde el backend.

---

## Lab 07 — Seguridad con Keycloak

**Objetivo:** Implementar autenticación y autorización con Keycloak usando OAuth2.

**Actividades:**
- Acceder a la consola de Keycloak en `http://localhost:8180`.
- Crear el realm `hotelbooking`.
- Crear el cliente público `hotelbooking-web`.
- Definir los roles `ADMIN` y `CUSTOMER`.
- Crear el usuario administrador con rol `ADMIN`.
- Integrar la validación JWT en el API Gateway.
- Proteger las rutas del panel administrador en Angular.

**Evidencia esperada:** El panel admin es accesible solo con credenciales Keycloak válidas.

---

## Lab 08 — Observabilidad (Prometheus + Grafana)

**Objetivo:** Implementar observabilidad completa con Prometheus y Grafana.

**Actividades:**
- Habilitar el endpoint `/actuator/prometheus` en cada microservicio.
- Configurar `prometheus.yml` con los targets de los microservicios.
- Levantar el stack de observabilidad con `docker compose -f docker-compose.yml up -d`.
- Configurar Grafana con el datasource Prometheus.
- Importar dashboard JVM para visualizar métricas.

**Evidencia esperada:** `http://localhost:9090/targets` muestra todos los targets en estado `UP`. Dashboard de Grafana con métricas reales.

---

## Lab 09 — Flujo completo: Reservas y Pagos

**Objetivo:** Validar el flujo end-to-end del sistema desde el registro del cliente hasta la confirmación del pago.

**Actividades:**
- Registrar un nuevo cliente en el portal.
- Iniciar sesión y navegar al catálogo de habitaciones.
- Seleccionar una habitación y realizar una reserva.
- Completar el proceso de pago con un método disponible.
- Verificar en el panel admin que la reserva y el pago están registrados.
- Capturar las notificaciones generadas por el sistema.

**Evidencia esperada:** Capturas del flujo completo mostrando cada paso exitosamente completado.

---

## Resumen de laboratorios

| Lab | Tema | Componente principal |
|---|---|---|
| 01 | Arquitectura base y Docker | docker-compose-dev.yml |
| 02 | Config Server | infra/config-server |
| 03 | Eureka Registry | infra/registry-server |
| 04 | API Gateway | infra/gateway |
| 05 | Microservicios de negocio | services/ms-*-service |
| 06 | Frontend Angular | clients/hotelbooking-web |
| 07 | Seguridad Keycloak | Keycloak realm + Gateway JWT |
| 08 | Observabilidad | observability/ |
| 09 | Flujo completo | Sistema integrado end-to-end |
