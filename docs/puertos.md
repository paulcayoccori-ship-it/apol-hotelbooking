# Puertos del Sistema

## Tabla completa de puertos

| Servicio | Puerto | URL local | Descripción |
|---|---|---|---|
| **Frontend Angular** | 4200 | http://localhost:4200 | Portal cliente y panel admin |
| **Config Server** | 7071 | http://localhost:7071 | Configuración centralizada |
| **Eureka Registry** | 7081 | http://localhost:7081 | Descubrimiento de servicios |
| **API Gateway** | 7091 | http://localhost:7091 | Punto de entrada único |
| **Keycloak** | 8180 | http://localhost:8180 | Autenticación OAuth2 |
| **ms-user-service** | 8081 | http://localhost:8081 | Gestión de usuarios |
| **ms-room-service** | 8082 | http://localhost:8082 | Gestión de habitaciones |
| **ms-booking-service** | 8083 | http://localhost:8083 | Gestión de reservas |
| **ms-payment-service** | 8084 | http://localhost:8084 | Gestión de pagos |
| **ms-notification-service** | 8085 | http://localhost:8085 | Notificaciones |
| **Prometheus** | 9090 | http://localhost:9090 | Métricas del sistema |
| **Grafana** | 3000 | http://localhost:3000 | Dashboards |

---

## Puertos de bases de datos MySQL

| Base de datos | Puerto host | Contenedor Docker | Base de datos |
|---|---|---|---|
| MySQL Usuario | 3307 | mysql-user | db_hotel_user |
| MySQL Habitaciones | 3308 | mysql-room | db_hotel_room |
| MySQL Reservas | 3309 | mysql-booking | db_hotel_booking |
| MySQL Pagos | 3310 | mysql-payment | db_hotel_payment |
| MySQL Notificaciones | 3311 | mysql-notification | db_hotel_notification |

!!! info "Puerto interno"
    Dentro de Docker, cada MySQL corre en el puerto `3306`. El mapeo al host usa puertos distintos (3307–3311) para evitar conflictos.

---

## URLs de verificación rápida

### Infraestructura

```powershell
# Config Server - configuración de ms-room-service
http://localhost:7071/ms-room-service/dev

# Eureka - dashboard de servicios registrados
http://localhost:7081

# Gateway - estado de salud
http://localhost:7091/actuator/health

# Keycloak - consola de administración
http://localhost:8180
```

### Microservicios — Health Checks

```powershell
http://localhost:8081/actuator/health   # ms-user-service
http://localhost:8082/actuator/health   # ms-room-service
http://localhost:8083/actuator/health   # ms-booking-service
http://localhost:8084/actuator/health   # ms-payment-service
http://localhost:8085/actuator/health   # ms-notification-service
```

### Observabilidad

```powershell
http://localhost:9090/targets    # Prometheus targets
http://localhost:3000            # Grafana dashboards
```

### Frontend

```powershell
http://localhost:4200              # Página principal
http://localhost:4200/rooms        # Catálogo de habitaciones
http://localhost:4200/promotions   # Promociones
http://localhost:4200/client-login # Login del cliente
http://localhost:4200/login        # Panel administrador
```

---

## Verificación completa con PowerShell

```powershell
$urls = @(
    "http://localhost:4200",
    "http://localhost:7071/ms-room-service/dev",
    "http://localhost:7081",
    "http://localhost:7091/actuator/health",
    "http://localhost:8081/actuator/health",
    "http://localhost:8082/actuator/health",
    "http://localhost:8083/actuator/health",
    "http://localhost:8084/actuator/health",
    "http://localhost:8085/actuator/health",
    "http://localhost:9090/targets",
    "http://localhost:3000"
)

foreach ($url in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing
        Write-Host "✅ $url → $($r.StatusCode)"
    } catch {
        Write-Host "❌ $url → NO RESPONDE"
    }
}
```
