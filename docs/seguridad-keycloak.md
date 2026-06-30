# Seguridad con Keycloak

## ¿Qué es Keycloak en este proyecto?

**Keycloak** es el servidor de identidad (Identity Provider) del sistema HotelBooking. Gestiona la autenticación y autorización de todos los usuarios, implementando los estándares **OAuth2** y **OpenID Connect (OIDC)**.

Keycloak se ejecuta en el puerto `8180` y es levantado automáticamente por Docker Compose.

```
Cliente Angular
    │
    │ 1. Solicita token (credenciales)
    ▼
Keycloak (8180)
    │
    │ 2. Devuelve JWT (access_token)
    ▼
Angular guarda el token

Angular
    │
    │ 3. Petición con header: Authorization: Bearer <JWT>
    ▼
API Gateway (7091)
    │
    │ 4. Valida el JWT contra Keycloak
    ▼
Microservicio correspondiente
```

---

## Configuración del Realm

El realm agrupa todos los recursos de seguridad del proyecto.

| Parámetro | Valor |
|---|---|
| **Realm** | `hotelbooking` |
| **Consola** | http://localhost:8180 |
| **Admin inicial** | `admin` / `admin` |

### Cómo acceder a la consola

1. Abrir `http://localhost:8180`.
2. Iniciar sesión con usuario `admin` y contraseña `admin`.
3. Seleccionar el realm `hotelbooking` en el selector superior izquierdo.

---

## Configuración del Cliente

El cliente representa la aplicación Angular que consume Keycloak.

| Parámetro | Valor |
|---|---|
| **Client ID** | `hotelbooking-web` |
| **Client Authentication** | OFF (cliente público) |
| **Standard Flow** | Habilitado |
| **Direct Access Grants** | Habilitado |
| **Root URL** | `http://localhost:4200` |
| **Home URL** | `http://localhost:4200` |
| **Valid Redirect URIs** | `http://localhost:4200/*` |
| **Web Origins** | `http://localhost:4200` |

---

## Roles del sistema

| Rol | Descripción | Acceso |
|---|---|---|
| `ADMIN` | Administrador del hotel | Panel admin: habitaciones, usuarios, reservas, pagos, notificaciones |
| `CUSTOMER` | Cliente registrado | Portal: reservas, pagos, historial |

### Crear usuario administrador en Keycloak

1. Ir a `http://localhost:8180` → Realm `hotelbooking`.
2. Menú **Users** → **Create new user**.
3. Completar:
   - **Username:** `admin`
   - **Email verified:** ON
4. Pestaña **Credentials** → Set password:
   - Password: `admin123`
   - Temporary: OFF
5. Pestaña **Role Mapping** → Assign role `ADMIN`.

---

## Flujo de token (OAuth2 Password Grant)

```
POST http://localhost:8180/realms/hotelbooking/protocol/openid-connect/token

Body (form-data):
  grant_type = password
  client_id  = hotelbooking-web
  username   = admin
  password   = admin123

Respuesta:
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 300,
  "refresh_token": "eyJhbGc..."
}
```

---

## Rutas públicas y protegidas

### Rutas públicas (sin token)

Estas rutas son accesibles sin autenticación:

| Ruta Angular | Descripción |
|---|---|
| `/` | Página principal con habitaciones |
| `/rooms` | Catálogo de habitaciones |
| `/promotions` | Promociones activas |
| `/client-login` | Login del cliente |
| `/client-register` | Registro de nuevo cliente |

### Rutas protegidas (requieren autenticación)

| Ruta Angular | Rol requerido | Descripción |
|---|---|---|
| `/login` | `ADMIN` | Acceso al panel administrador |
| `/admin/**` | `ADMIN` | Panel completo de administración |
| `/booking/**` | `CUSTOMER` | Proceso de reserva |
| `/payment/**` | `CUSTOMER` | Proceso de pago |

---

## Verificación de seguridad

### Probar token desde Postman o PowerShell

```powershell
$body = @{
    grant_type = "password"
    client_id  = "hotelbooking-web"
    username   = "admin"
    password   = "admin123"
}

$response = Invoke-RestMethod `
    -Uri "http://localhost:8180/realms/hotelbooking/protocol/openid-connect/token" `
    -Method POST `
    -Body $body

$response.access_token
```

Si Keycloak devuelve un `access_token`, la configuración está correcta.

---

## Integración con el API Gateway

El Gateway valida cada petición contra Keycloak antes de enrutarla al microservicio. Si el token es inválido o está expirado, el Gateway responde con `401 Unauthorized`.

```yaml
# Configuración en gateway-dev.yml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8180/realms/hotelbooking
```
