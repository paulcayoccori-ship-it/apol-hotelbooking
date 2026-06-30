# Evaluación y Evidencias

## Lista de evidencias requeridas

Para la sustentación del proyecto HotelBooking se deben presentar las siguientes evidencias de funcionamiento:

---

## E1 — Repositorio GitHub

| Ítem | Estado |
|---|---|
| Repositorio público en GitHub | ✅ |
| Rama `main` con código completo | ✅ |
| README.md con documentación académica | ✅ |
| Documentación MkDocs publicada en GitHub Pages | ✅ |

**URL del repositorio:**
```
https://github.com/paulcayoccori-ship-it/apol-hotelbooking
```

**URL de la documentación web:**
```
https://paulcayoccori-ship-it.github.io/apol-hotelbooking/
```

---

## E2 — Docker funcionando

Evidencia: captura de `docker ps` mostrando todos los contenedores en estado `Up`.

```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Contenedores esperados:

| Contenedor | Estado |
|---|---|
| mysql-user | Up |
| mysql-room | Up |
| mysql-booking | Up |
| mysql-payment | Up |
| mysql-notification | Up |
| keycloak | Up |
| prometheus | Up |
| grafana | Up |
| loki | Up |
| promtail | Up |

---

## E3 — Config Server activo

Evidencia: captura de la respuesta JSON del Config Server.

```
URL: http://localhost:7071/ms-room-service/dev
```

Respuesta esperada: JSON con la configuración del microservicio (puerto, datasource, eureka URL).

---

## E4 — Eureka con servicios registrados

Evidencia: captura del dashboard Eureka mostrando los 6 servicios registrados.

```
URL: http://localhost:7081
```

Servicios esperados registrados:

- ✅ `GATEWAY`
- ✅ `MS-USER-SERVICE`
- ✅ `MS-ROOM-SERVICE`
- ✅ `MS-BOOKING-SERVICE`
- ✅ `MS-PAYMENT-SERVICE`
- ✅ `MS-NOTIFICATION-SERVICE`

---

## E5 — Gateway activo

Evidencia: captura de la respuesta del health check del Gateway.

```
URL: http://localhost:7091/actuator/health
Respuesta esperada: {"status":"UP"}
```

---

## E6 — Frontend funcionando

Evidencia: capturas de pantalla de las páginas:

| Página | URL |
|---|---|
| Página principal con habitaciones | http://localhost:4200 |
| Catálogo de habitaciones | http://localhost:4200/rooms |
| Formulario de registro | http://localhost:4200/client-register |
| Formulario de login | http://localhost:4200/client-login |
| Panel de administración | http://localhost:4200/login |

---

## E7 — Keycloak configurado

Evidencia: capturas de la consola de Keycloak mostrando:

- Realm `hotelbooking` creado.
- Cliente `hotelbooking-web` configurado.
- Usuario con rol `ADMIN` creado.
- URL: `http://localhost:8180`

---

## E8 — Prometheus con targets activos

Evidencia: captura de `http://localhost:9090/targets` mostrando todos los microservicios con estado `UP`.

---

## E9 — Grafana con métricas

Evidencia: captura de `http://localhost:3000` con dashboard de métricas JVM activo, mostrando datos reales de los microservicios.

---

## E10 — Flujo completo de reserva y pago

Evidencia: secuencia de capturas mostrando el flujo completo:

1. Visualización de habitaciones en el home.
2. Registro de un nuevo cliente.
3. Inicio de sesión exitoso.
4. Selección de habitación y fechas.
5. Confirmación de la reserva.
6. Selección de método de pago.
7. Confirmación del pago exitoso.
8. Panel admin mostrando la reserva y el pago registrados.

---

## Rúbrica de evaluación sugerida

| Criterio | Peso | Descripción |
|---|---|---|
| Infraestructura Docker | 15% | Docker Compose funciona, contenedores levantados |
| Config Server | 10% | Centraliza configuración correctamente |
| Eureka | 10% | Todos los servicios registrados |
| API Gateway | 10% | Enruta correctamente, valida JWT |
| Microservicios | 20% | Los 5 servicios responden y operan |
| Keycloak | 10% | Autenticación funciona, roles configurados |
| Frontend Angular | 10% | Portal y admin funcionando |
| Observabilidad | 10% | Prometheus y Grafana muestran métricas |
| Documentación | 5% | README y sitio MkDocs completos |

**Total: 100%**
