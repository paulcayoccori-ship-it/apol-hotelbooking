# Flujo de Trabajo

## Flujo del cliente

### Paso 1 — Ingreso al portal

El cliente abre el navegador y accede a `http://localhost:4200`. La página principal muestra las habitaciones disponibles y promociones activas.

```
Cliente abre http://localhost:4200
    │
    ▼
Angular carga el componente HomeComponent
    │
    ▼
Llama a: GET http://localhost:7091/api/rooms?status=AVAILABLE
    │
    ▼
Gateway → ms-room-service (8082) → MySQL room (3308)
    │
    ▼
Respuesta: lista de habitaciones disponibles
    │
    ▼
Se muestran las cards con precio y botón "Reservar ahora"
```

---

### Paso 2 — Registro de nuevo cliente

Si el cliente no tiene cuenta, accede a `http://localhost:4200/client-register`.

```
POST http://localhost:7091/api/users/register
Body: {
    fullName: "Juan Pérez",
    documentType: "DNI",
    documentNumber: "12345678",
    password: "segura123",
    phone: "999888777",
    email: "juan@example.com"
}
    │
    ▼
Gateway → ms-user-service (8081) → MySQL user (3307)
    │
    ▼
Cuenta creada → redirige a /client-login
```

---

### Paso 3 — Inicio de sesión del cliente

```
POST http://localhost:7091/api/users/login
Body: {
    documentNumber: "12345678",
    password: "segura123"
}
    │
    ▼
ms-user-service valida credenciales
    │
    ▼
Devuelve datos del cliente
    │
    ▼
Angular guarda sesión en localStorage
    │
    ▼
Redirige a la página anterior o a /rooms
```

---

### Paso 4 — Selección y reserva de habitación

```
Cliente hace clic en "Reservar ahora"
    │
    ▼
Angular navega a /booking/:roomId
    │
    ▼
Se muestra el formulario con:
    - Resumen de la habitación
    - Selector de fecha check-in
    - Selector de fecha check-out
    - Precio total estimado
    │
    ▼
Cliente confirma
    │
    ▼
POST http://localhost:7091/api/bookings
Body: {
    clientId: 1,
    roomId: 3,
    checkIn: "2025-07-01",
    checkOut: "2025-07-05"
}
    │
    ▼
ms-booking-service crea la reserva en estado PENDING
ms-notification-service registra evento BOOKING_CREATED
    │
    ▼
Angular redirige a /payment/:bookingId
```

---

### Paso 5 — Pago de la reserva

```
Cliente elige método de pago:
    ┌── Tarjeta de crédito/débito
    ├── Yape
    ├── Plin
    ├── Transferencia bancaria
    └── Efectivo
    │
    ▼
Cliente confirma el pago
    │
    ▼
POST http://localhost:7091/api/payments
Body: {
    bookingId: 10,
    method: "YAPE",
    amount: 1400.00
}
    │
    ▼
ms-payment-service registra el pago como COMPLETED
ms-booking-service actualiza la reserva a CONFIRMED
ms-notification-service registra evento PAYMENT_COMPLETED
    │
    ▼
Angular muestra pantalla de confirmación exitosa
```

---

## Flujo del administrador

### Acceso al panel

```
Admin abre http://localhost:4200/login
    │
    ▼
Formulario de login → Keycloak valida credenciales
    │
    ▼
Keycloak emite JWT con rol ADMIN
    │
    ▼
Angular guarda el token y redirige al panel admin
    │
    ▼
Panel con sidebar de navegación:
    ├── Habitaciones
    ├── Usuarios
    ├── Reservas
    ├── Pagos
    ├── Promociones
    └── Notificaciones
```

### Gestión de habitaciones

```
Admin → Habitaciones → "Nueva habitación"
    │
    ▼
POST http://localhost:7091/api/rooms
Headers: Authorization: Bearer <JWT>
Body: {
    roomNumber: "201",
    type: "SUITE",
    capacity: 2,
    pricePerNight: 550.00,
    description: "Suite de lujo con vista al mar"
}
    │
    ▼
Gateway valida JWT → ms-room-service crea la habitación
    │
    ▼
La habitación aparece en el listado del admin y en el portal público
```

---

## Flujo técnico completo

```
┌──────────┐    HTTP     ┌─────────┐   REST    ┌──────────────────┐
│ Angular  │ ──────────► │ Gateway │ ─────────► │ Microservicio    │
│  :4200   │            │  :7091  │            │ :8081-8085       │
└──────────┘            └────┬────┘            └────────┬─────────┘
                             │                          │
                    valida JWT                     ┌────▼────┐
                             │                     │  MySQL  │
                    ┌────────▼────────┐            │ :330x   │
                    │   Keycloak      │            └─────────┘
                    │    :8180        │
                    └─────────────────┘

Registro en:
    ┌──────────────────────────────────────────────────┐
    │  Eureka :7081  ◄── se registran todos al arrancar│
    └──────────────────────────────────────────────────┘

Configuración desde:
    ┌──────────────────────────────────────────────────┐
    │  Config Server :7071  ◄── leen config al arrancar│
    └──────────────────────────────────────────────────┘

Monitoreo en:
    ┌──────────────────────────────────────────────────┐
    │  Prometheus :9090  ◄── scrapea /actuator/prometheus│
    │  Grafana :3000     ◄── lee de Prometheus         │
    └──────────────────────────────────────────────────┘
```
