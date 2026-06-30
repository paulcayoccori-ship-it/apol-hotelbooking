# Desarrollo DEV — Levantar el Proyecto

## Pre-requisitos

Antes de comenzar, verificar que todas las herramientas estén instaladas:

```powershell
java -version        # Debe ser Java 17+
mvn -version         # Maven 3.9+
node --version       # Node.js 18+
npm --version        # npm 9+
docker --version     # Docker 24+
git --version        # Git 2.x
```

---

## Ruta del proyecto

```
C:\aaaaaaaaaaaaaapol\apol-hotelbooking\
```

---

## Paso 1 — Clonar el repositorio

```powershell
git clone https://github.com/paulcayoccori-ship-it/apol-hotelbooking.git
cd apol-hotelbooking
```

---

## Paso 2 — Levantar infraestructura Docker

Este paso levanta los 5 contenedores MySQL y Keycloak.

```powershell
Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking"
docker compose -f docker-compose-dev.yml up -d
docker ps
```

### Contenedores esperados

| Contenedor | Puerto host | Descripción |
|---|---|---|
| `mysql-user` | 3307 | Base de datos de usuarios |
| `mysql-room` | 3308 | Base de datos de habitaciones |
| `mysql-booking` | 3309 | Base de datos de reservas |
| `mysql-payment` | 3310 | Base de datos de pagos |
| `mysql-notification` | 3311 | Base de datos de notificaciones |
| `keycloak` | 8180 | Servidor de autenticación |

!!! warning "Espera"
    Espera 30 segundos antes del siguiente paso para que MySQL y Keycloak terminen de inicializar.

---

## Paso 3 — Levantar Config Server

```powershell
Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\infra\config-server"
mvn spring-boot:run
```

**Verificación:**

```powershell
Invoke-WebRequest -Uri "http://localhost:7071/ms-room-service/dev" -UseBasicParsing
```

Debe responder JSON con la configuración del microservicio de habitaciones.

---

## Paso 4 — Levantar Eureka Registry

Abrir nueva terminal:

```powershell
Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\infra\registry-server"
mvn spring-boot:run
```

**Verificación:**

Abrir `http://localhost:7081` en el navegador. Debe mostrar el dashboard de Eureka.

---

## Paso 5 — Levantar los microservicios

Abrir una terminal separada para cada microservicio:

=== "ms-user-service"

    ```powershell
    Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\services\ms-user-service"
    mvn spring-boot:run
    ```

=== "ms-room-service"

    ```powershell
    Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\services\ms-room-service"
    mvn spring-boot:run
    ```

=== "ms-booking-service"

    ```powershell
    Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\services\ms-booking-service"
    mvn spring-boot:run
    ```

=== "ms-payment-service"

    ```powershell
    Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\services\ms-payment-service"
    mvn spring-boot:run
    ```

=== "ms-notification-service"

    ```powershell
    Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\services\ms-notification-service"
    mvn spring-boot:run
    ```

**Verificación de salud:**

```powershell
Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8082/actuator/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8083/actuator/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8084/actuator/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8085/actuator/health" -UseBasicParsing
```

Todos deben responder: `{"status":"UP"}`

---

## Paso 6 — Levantar el API Gateway

```powershell
Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\infra\gateway"
mvn spring-boot:run
```

**Verificación:**

```powershell
Invoke-WebRequest -Uri "http://localhost:7091/actuator/health" -UseBasicParsing
```

Respuesta esperada: `{"status":"UP"}`

---

## Paso 7 — Levantar el Frontend Angular

```powershell
Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\clients\hotelbooking-web"
npm install
npm start
```

**Verificación:**

Abrir `http://localhost:4200` en el navegador. Debe mostrar la página principal con habitaciones.

---

## Paso 8 — Levantar Observabilidad

```powershell
Set-Location "C:\aaaaaaaaaaaaaapol\apol-hotelbooking\observability"
docker compose -f docker-compose.yml up -d
```

| Herramienta | URL |
|---|---|
| Prometheus | http://localhost:9090/targets |
| Grafana | http://localhost:3000 |

---

## Verificación final — Eureka

Abrir `http://localhost:7081` y confirmar que aparecen registrados:

- ✅ `GATEWAY`
- ✅ `MS-USER-SERVICE`
- ✅ `MS-ROOM-SERVICE`
- ✅ `MS-BOOKING-SERVICE`
- ✅ `MS-PAYMENT-SERVICE`
- ✅ `MS-NOTIFICATION-SERVICE`

---

## Orden de arranque recomendado

```
1. Docker (MySQL + Keycloak)
2. Config Server         ← dependen todos
3. Eureka Registry       ← dependen todos
4. Microservicios        ← 5 terminales paralelas
5. API Gateway           ← después de microservicios
6. Frontend Angular      ← independiente
7. Observabilidad        ← independiente
```

!!! danger "Importante"
    **Config Server y Eureka deben estar activos antes de levantar cualquier microservicio.** Si se levantan en orden incorrecto, los microservicios no encontrarán su configuración ni podrán registrarse.
