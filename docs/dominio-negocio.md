# Dominio de Negocio

## Contexto del problema

Un hotel necesita un sistema digital para gestionar sus habitaciones y permitir que los clientes realicen reservas en línea. El sistema debe cubrir el ciclo completo: desde la consulta de disponibilidad hasta la confirmación del pago.

---

## Entidades principales

### Cliente

Representa a la persona que utiliza el portal para reservar habitaciones.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Identificador único |
| `fullName` | String | Nombre completo |
| `documentType` | Enum | DNI / CARNET_EXTRANJERIA |
| `documentNumber` | String | Número de documento (único) |
| `password` | String | Contraseña cifrada |
| `phone` | String | Teléfono (opcional) |
| `email` | String | Correo electrónico (opcional) |
| `role` | Enum | CUSTOMER / ADMIN |

---

### Habitación

Representa una habitación del hotel disponible para reserva.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Identificador único |
| `roomNumber` | String | Número de habitación |
| `type` | Enum | SINGLE / DOUBLE / SUITE / FAMILIAR |
| `capacity` | Integer | Número máximo de personas |
| `pricePerNight` | Decimal | Precio por noche en soles (S/) |
| `description` | String | Descripción de la habitación |
| `imageUrl` | String | URL de la imagen |
| `status` | Enum | AVAILABLE / OCCUPIED / MAINTENANCE |

---

### Reserva (Booking)

Registra la solicitud de un cliente para ocupar una habitación durante un período.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Identificador único |
| `clientId` | Long | Referencia al cliente |
| `roomId` | Long | Referencia a la habitación |
| `checkIn` | Date | Fecha de entrada |
| `checkOut` | Date | Fecha de salida |
| `totalPrice` | Decimal | Precio total calculado |
| `status` | Enum | PENDING / CONFIRMED / CANCELLED |
| `createdAt` | DateTime | Fecha de creación |

**Precio total:** `totalPrice = pricePerNight × número de noches`

---

### Pago (Payment)

Registra la transacción de pago asociada a una reserva.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Identificador único |
| `bookingId` | Long | Referencia a la reserva |
| `amount` | Decimal | Monto pagado |
| `method` | Enum | CARD / YAPE / PLIN / TRANSFER / CASH |
| `status` | Enum | PENDING / COMPLETED / FAILED |
| `paidAt` | DateTime | Fecha y hora del pago |

---

### Promoción

Representa un descuento aplicado sobre el precio de una habitación.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Identificador único |
| `roomId` | Long | Habitación asociada |
| `promotionTitle` | String | Título de la promoción |
| `promotionDescription` | String | Descripción detallada |
| `discountPercent` | Integer | Porcentaje de descuento (0-100) |
| `promotionPrice` | Decimal | Precio final con descuento |
| `active` | Boolean | Si la promoción está activa |

---

### Notificación

Registra los eventos importantes del sistema para su seguimiento.

| Atributo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Identificador único |
| `type` | Enum | BOOKING_CREATED / PAYMENT_COMPLETED / etc. |
| `message` | String | Mensaje descriptivo del evento |
| `referenceId` | Long | ID de la entidad relacionada |
| `createdAt` | DateTime | Fecha de generación |

---

## Flujo completo del negocio

```
Cliente accede al portal
    │
    ▼
[1] Visualiza habitaciones disponibles
    │
    ▼
[2] Selecciona una habitación
    │
    ├── ¿Tiene cuenta?
    │       │
    │   NO  ▼
    │   Registro (nombre, documento, contraseña)
    │       │
    │   SÍ  ▼
    │   Inicio de sesión (documento + contraseña)
    │
    ▼
[3] Selecciona fechas (check-in / check-out)
    │
    ▼
[4] Confirma la reserva
    │
    │   ms-booking-service crea la reserva en estado PENDING
    │   ms-notification-service genera notificación BOOKING_CREATED
    │
    ▼
[5] Elige método de pago
    │   Tarjeta / Yape / Plin / Transferencia / Efectivo
    │
    ▼
[6] Confirma el pago
    │
    │   ms-payment-service registra el pago en estado COMPLETED
    │   ms-booking-service actualiza la reserva a CONFIRMED
    │   ms-notification-service genera notificación PAYMENT_COMPLETED
    │
    ▼
[7] Cliente recibe confirmación en pantalla
```

---

## Flujo del administrador

```
Admin accede a http://localhost:4200/login
    │
    ▼
Login con Keycloak (rol ADMIN)
    │
    ▼
Panel de administración
    │
    ├─► Habitaciones    → CRUD completo
    ├─► Usuarios        → Listado y gestión
    ├─► Reservas        → Visualización por estado
    ├─► Pagos           → Historial y métodos
    ├─► Promociones     → Crear y activar descuentos
    └─► Notificaciones  → Eventos del sistema
```

---

## Estados de los recursos

### Habitación

```
AVAILABLE ──► (reserva creada) ──► OCCUPIED ──► (check-out) ──► AVAILABLE
     │
     └──► (en mantenimiento) ──► MAINTENANCE ──► (listo) ──► AVAILABLE
```

### Reserva

```
PENDING ──► (pago exitoso) ──► CONFIRMED
   │
   └──► (cancelación) ──► CANCELLED
```

### Pago

```
PENDING ──► (transacción exitosa) ──► COMPLETED
   │
   └──► (error) ──► FAILED
```
