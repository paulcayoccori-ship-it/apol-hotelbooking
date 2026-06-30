# Observabilidad

## Stack de observabilidad

HotelBooking implementa observabilidad completa con el stack **Prometheus + Grafana + Loki + Promtail**, levantado con Docker Compose en la carpeta `observability/`.

```
Microservicios
    │ exponen /actuator/prometheus
    ▼
Prometheus (9090)  ──► recolecta métricas cada 15s
    │
    ▼
Grafana (3000)  ──► visualiza dashboards de métricas

Logs de microservicios
    │
    ▼
Promtail  ──► recolecta y reenvía logs
    │
    ▼
Loki  ──► almacena y consulta logs
    │
    ▼
Grafana (3000)  ──► visualiza logs en tiempo real
```

---

## Levantar la observabilidad

```powershell
Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\observability"
docker compose -f docker-compose.yml up -d
docker ps
```

Contenedores esperados: `prometheus`, `grafana`, `loki`, `promtail`.

---

## Prometheus

**URL:** `http://localhost:9090`

Prometheus es el motor de recolección de métricas. Consulta el endpoint `/actuator/prometheus` de cada microservicio cada 15 segundos.

### Verificar targets activos

1. Abrir `http://localhost:9090/targets`.
2. Verificar que todos los microservicios aparecen en estado `UP`.

### Targets configurados

| Target | URL scrapeada |
|---|---|
| ms-user-service | http://localhost:8081/actuator/prometheus |
| ms-room-service | http://localhost:8082/actuator/prometheus |
| ms-booking-service | http://localhost:8083/actuator/prometheus |
| ms-payment-service | http://localhost:8084/actuator/prometheus |
| ms-notification-service | http://localhost:8085/actuator/prometheus |
| gateway | http://localhost:7091/actuator/prometheus |

### Métricas disponibles

| Métrica | Descripción |
|---|---|
| `jvm_memory_used_bytes` | Memoria JVM utilizada |
| `jvm_gc_pause_seconds` | Tiempo de garbage collection |
| `http_server_requests_seconds` | Latencia y conteo de peticiones HTTP |
| `process_cpu_usage` | Uso de CPU del proceso |
| `hikaricp_connections_active` | Conexiones activas al pool de BD |
| `spring_data_repository_invocations` | Llamadas a repositorios JPA |

---

## Grafana

**URL:** `http://localhost:3000`

Grafana visualiza las métricas recolectadas por Prometheus y los logs de Loki.

### Primer acceso

- **Usuario:** `admin`
- **Contraseña:** `admin`
- Al ingresar por primera vez, Grafana pedirá cambiar la contraseña.

### Configurar datasource Prometheus

1. Ir a **Connections → Data sources → Add data source**.
2. Seleccionar **Prometheus**.
3. URL: `http://prometheus:9090`.
4. Click en **Save & Test**.

### Importar dashboard JVM

1. Ir a **Dashboards → Import**.
2. Ingresar el ID: `4701` (JVM Micrometer dashboard).
3. Seleccionar el datasource Prometheus.
4. Click en **Import**.

---

## Spring Boot Actuator

Cada microservicio expone endpoints de monitoreo mediante **Spring Boot Actuator**:

| Endpoint | Descripción |
|---|---|
| `/actuator/health` | Estado general del servicio |
| `/actuator/info` | Información del servicio |
| `/actuator/metrics` | Lista de métricas disponibles |
| `/actuator/prometheus` | Métricas en formato Prometheus |

### Ejemplo de health check

```powershell
# ms-user-service
Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -UseBasicParsing

# Respuesta esperada:
# {"status":"UP","components":{"db":{"status":"UP"},"eureka":{"status":"UP"}}}
```

---

## Eureka como evidencia de registro

El dashboard de Eureka en `http://localhost:7081` muestra en tiempo real todos los microservicios registrados y su estado:

| Servicio registrado | Estado esperado |
|---|---|
| GATEWAY | UP |
| MS-USER-SERVICE | UP |
| MS-ROOM-SERVICE | UP |
| MS-BOOKING-SERVICE | UP |
| MS-PAYMENT-SERVICE | UP |
| MS-NOTIFICATION-SERVICE | UP |

!!! tip "Evidencia de Eureka"
    La captura del dashboard de Eureka con todos los servicios en estado `UP` es una de las evidencias principales del proyecto.

---

## URLs de observabilidad

| Herramienta | URL | Credenciales |
|---|---|---|
| Eureka Dashboard | http://localhost:7081 | Sin autenticación |
| Prometheus | http://localhost:9090 | Sin autenticación |
| Prometheus Targets | http://localhost:9090/targets | Sin autenticación |
| Grafana | http://localhost:3000 | admin / admin |
