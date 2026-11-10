# GarrafaYa API REST

API REST construida con Node.js, Express y PostgreSQL para el esquema relacional proporcionado.

## 1. Requisitos
- Node.js 20 o superior.
- PostgreSQL 14 o superior.
- Visual Studio Code (opcional).

## 2. Crear la base de datos en CMD
Abre CMD:
```cmd
psql -U postgres -d postgres
```
Dentro de `psql`:
```sql
CREATE DATABASE garrafaya;
\q
```
Ejecuta el esquema (ajusta la ruta si descomprimiste en otro directorio):
```cmd
psql -U postgres -d garrafaya -f "C:\RUTA\GarrafaYa_API_REST\sql\schema.sql"
```

## 3. Configurar API
Abre CMD en la carpeta del proyecto:
```cmd
copy .env.example .env
```
Edita `.env` y coloca la contraseña real de tu usuario PostgreSQL en `DB_PASSWORD`. Cambia también `JWT_SECRET` por una cadena larga y aleatoria.

Instala dependencias:
```cmd
npm install
```
Crea el administrador, roles y permisos:
```cmd
npm run seed
```
Credenciales creadas:
- Login: `admin@garrafaya.bo` (también admite `admin`)
- Contraseña: `GarrafaYa2026!`

Inicia el servidor:
```cmd
npm run dev
```
o `npm start`.

API: `http://localhost`
Health: `http://localhost/api/v1/health`
Swagger interactivo: `http://localhost/api-docs/`

En Swagger, abre `POST /api/v1/auth/login`, envía el login y la contraseña de administrador, copia el campo `token` de la respuesta y pulsa **Authorize**. Pega solo el token; Swagger agrega automáticamente `Bearer` al llamar a los endpoints protegidos. El archivo OpenAPI también está disponible en `http://localhost/api-docs.json`.

## 4. Autenticación
`POST /api/v1/auth/login`
```json
{"login":"admin@garrafaya.bo","password":"GarrafaYa2026!"}
```
Usa el token devuelto en las demás rutas:
`Authorization: Bearer TU_TOKEN`

`GET /api/v1/auth/me` devuelve el usuario autenticado.

## 5. Recursos CRUD
Para todos los recursos siguientes existen:
- `GET /api/v1/RECURSO` (listar; admite `?limit=100&offset=0`)
- `GET /api/v1/RECURSO/:id` (consultar uno)
- `POST /api/v1/RECURSO` (crear)
- `PUT /api/v1/RECURSO/:id` (actualizar)
- `DELETE /api/v1/RECURSO/:id` (eliminar, excepto recursos protegidos)

Recursos: `roles`, `permissions`, `customers`, `customer_contacts`, `customer_addresses`, `products`, `warehouses`, `vehicles`, `vehicle_maintenance`, `staff`, `driver_licenses`, `routes`, `route_stops`, `orders`, `order_details`, `dispatches`, `payments`, `incidents`. `inventory` e `inventory_movements` son de consulta; para modificar existencias utiliza el endpoint transaccional.

Usuarios tienen `GET`, `GET/:id`, `POST` específico y cambio de contraseña `PATCH /api/v1/users/:id/password`. `access_logs` y `audit_logs` son de consulta.

## 6. Ejemplos de JSON

Crear cliente:
```json
{"name":"Cliente Demo","type":"particular"}
```
Crear producto:
```json
{"name":"Garrafa 10 kg","gas_type":"GLP","capacity_kg":10,"price":22.5,"availability_status":"available"}
```
Crear almacén:
```json
{"name":"Almacén Central","location":"La Paz"}
```
Registrar una entrada inicial de inventario (`POST /api/v1/inventory-movements-advanced`):
```json
{"product_id":1,"warehouse_id":1,"movement_type":"entry","quantity":50}
```
Crear vehículo:
```json
{"license_plate":"1234ABC","model":"NPR","brand":"Isuzu","load_capacity":100,"status":"available"}
```
Crear incidente:
```json
{"description":"Demora por bloqueo","location":"Av. principal","severity_level":"medium","resolution_status":"unresolved"}
```

## 7. Endpoints completos
| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/v1/health` | Estado de API y BD |
| POST | `/api/v1/auth/login` | Iniciar sesión |
| GET | `/api/v1/auth/me` | Perfil autenticado |
| GET/POST | `/api/v1/users` | Consultar/crear usuarios |
| PATCH | `/api/v1/users/:id/password` | Cambiar contraseña |
| GET/POST/PUT/DELETE | `/api/v1/customers` | CRUD clientes |
| GET/POST/PUT/DELETE | `/api/v1/products` | CRUD productos |
| GET | `/api/v1/inventory` | Consultar existencias |
| GET/POST/PUT/DELETE | `/api/v1/vehicles` | CRUD vehículos |
| GET/POST/PUT/DELETE | `/api/v1/routes` | CRUD rutas |
| GET/POST/PUT/DELETE | `/api/v1/orders` | CRUD pedidos |
| GET/POST/PUT/DELETE | `/api/v1/dispatches` | CRUD despachos |
| GET/POST/PUT/DELETE | `/api/v1/payments` | CRUD pagos |
| GET/POST/PUT/DELETE | `/api/v1/incidents` | CRUD incidentes |

Los recursos restantes siguen el mismo patrón CRUD. Los nombres de campos y restricciones son los definidos por el esquema SQL.

### Operaciones transaccionales
| Método | Endpoint | Función |
|---|---|---|
| POST | `/api/v1/orders-advanced` | Crea un pedido pendiente y sus detalles en una sola transacción |
| POST | `/api/v1/inventory-movements-advanced` | Registra una entrada o salida y actualiza el stock de garrafas llenas en una sola transacción |

El inventario y sus movimientos son de solo lectura mediante CRUD; no se permite crear, actualizar o borrar registros directamente, para evitar que el stock y su historial diverjan. El movimiento avanzado solo admite `entry` y `exit`. Una salida que excede las existencias responde `409 Conflict`.

## 8. Notas importantes
- Esta entrega implementa CRUD genérico para acelerar el prototipo y autenticación real.
- Los roles y permisos se almacenan en la BD, pero la autorización fina por permiso (RBAC) todavía debe incorporarse antes de producción.
- Las operaciones complejas (confirmar pedido, despachar, transferir stock) necesitan endpoints transaccionales específicos; no se deben simular con varios CRUD separados.
- No se expone `password_hash` en respuestas de usuarios.
- Cambia las credenciales de ejemplo y restringe CORS antes de desplegar.

### Relaciones entre roles, usuarios y permisos
- `GET /api/v1/users/:userId/roles`
- `POST /api/v1/users/:userId/roles/:roleId`
- `DELETE /api/v1/users/:userId/roles/:roleId`
- `GET /api/v1/roles/:roleId/permissions`
- `POST /api/v1/roles/:roleId/permissions/:permissionId`
- `DELETE /api/v1/roles/:roleId/permissions/:permissionId`
