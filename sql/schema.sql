CREATE TABLE IF NOT EXISTS roles (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name text NOT NULL UNIQUE, description text
);
CREATE TABLE IF NOT EXISTS permissions (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name text NOT NULL UNIQUE, description text
);
CREATE TABLE IF NOT EXISTS users (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, username text NOT NULL UNIQUE,
 password_hash text NOT NULL, email text NOT NULL UNIQUE,
 created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_roles (
 user_id bigint REFERENCES users(id) ON DELETE CASCADE,
 role_id bigint REFERENCES roles(id) ON DELETE CASCADE, PRIMARY KEY(user_id,role_id)
);
CREATE TABLE IF NOT EXISTS role_permissions (
 role_id bigint REFERENCES roles(id) ON DELETE CASCADE,
 permission_id bigint REFERENCES permissions(id) ON DELETE CASCADE, PRIMARY KEY(role_id,permission_id)
);
CREATE TABLE IF NOT EXISTS access_logs (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, user_id bigint REFERENCES users(id) ON DELETE SET NULL,
 action text NOT NULL, "timestamp" timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS customers (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name text NOT NULL,
 type text CHECK(type IN ('particular','comercial')) NOT NULL,
 created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS customer_contacts (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, customer_id bigint REFERENCES customers(id) ON DELETE CASCADE,
 contact_type text CHECK(contact_type IN ('phone','email')) NOT NULL, contact_value text NOT NULL
);
CREATE TABLE IF NOT EXISTS customer_addresses (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, customer_id bigint REFERENCES customers(id) ON DELETE CASCADE,
 address text NOT NULL, city text NOT NULL, state text NOT NULL, postal_code text NOT NULL, country text NOT NULL
);
CREATE TABLE IF NOT EXISTS products (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name text NOT NULL, gas_type text NOT NULL,
 capacity_kg numeric NOT NULL CHECK(capacity_kg > 0), description text, price numeric NOT NULL CHECK(price >= 0),
 availability_status text CHECK(availability_status IN ('available','unavailable')) NOT NULL
);
CREATE TABLE IF NOT EXISTS warehouses (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name text NOT NULL, location text NOT NULL
);
CREATE TABLE IF NOT EXISTS inventory (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, product_id bigint REFERENCES products(id) ON DELETE CASCADE,
 warehouse_id bigint REFERENCES warehouses(id) ON DELETE CASCADE,
 full_cylinders int DEFAULT 0 CHECK(full_cylinders >= 0), empty_cylinders int DEFAULT 0 CHECK(empty_cylinders >= 0),
 damaged_cylinders int DEFAULT 0 CHECK(damaged_cylinders >= 0), UNIQUE(product_id,warehouse_id)
);
CREATE TABLE IF NOT EXISTS inventory_movements (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, inventory_id bigint REFERENCES inventory(id) ON DELETE CASCADE,
 movement_type text CHECK(movement_type IN ('entry','exit','transfer','adjustment')) NOT NULL,
 quantity int NOT NULL CHECK(quantity > 0), movement_date timestamptz DEFAULT now(),
 responsible_user_id bigint REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS vehicles (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, license_plate text NOT NULL UNIQUE,
 model text NOT NULL, brand text NOT NULL, load_capacity numeric NOT NULL CHECK(load_capacity > 0),
 status text CHECK(status IN ('available','in_use','maintenance','out_of_service')) NOT NULL
);
CREATE TABLE IF NOT EXISTS vehicle_maintenance (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, vehicle_id bigint REFERENCES vehicles(id) ON DELETE CASCADE,
 maintenance_date timestamptz DEFAULT now(), description text NOT NULL
);
CREATE TABLE IF NOT EXISTS staff (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name text NOT NULL, role text NOT NULL,
 employment_status text CHECK(employment_status IN ('active','inactive')) NOT NULL
);
CREATE TABLE IF NOT EXISTS driver_licenses (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, staff_id bigint REFERENCES staff(id) ON DELETE CASCADE,
 license_number text NOT NULL UNIQUE, expiration_date timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS routes (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name text NOT NULL,
 status text CHECK(status IN ('planned','active','completed','cancelled')) NOT NULL
);
CREATE TABLE IF NOT EXISTS route_stops (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, route_id bigint REFERENCES routes(id) ON DELETE CASCADE,
 stop_order int NOT NULL, location text NOT NULL, UNIQUE(route_id,stop_order)
);
CREATE TABLE IF NOT EXISTS orders (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, customer_id bigint REFERENCES customers(id) ON DELETE SET NULL,
 order_date timestamptz DEFAULT now(),
 status text CHECK(status IN ('pending','confirmed','preparing','assigned','in_distribution','delivered','cancelled')) NOT NULL
);
CREATE TABLE IF NOT EXISTS order_details (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, order_id bigint REFERENCES orders(id) ON DELETE CASCADE,
 product_id bigint REFERENCES products(id) ON DELETE CASCADE, quantity int NOT NULL CHECK(quantity > 0),
 unit_price numeric NOT NULL CHECK(unit_price >= 0)
);
CREATE TABLE IF NOT EXISTS dispatches (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, order_id bigint REFERENCES orders(id) ON DELETE SET NULL,
 vehicle_id bigint REFERENCES vehicles(id) ON DELETE SET NULL, driver_id bigint REFERENCES staff(id) ON DELETE SET NULL,
 dispatch_date timestamptz DEFAULT now(),
 delivery_status text CHECK(delivery_status IN ('pending','in_transit','delivered','failed')) NOT NULL
);
CREATE TABLE IF NOT EXISTS payments (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, order_id bigint REFERENCES orders(id) ON DELETE SET NULL,
 amount numeric NOT NULL CHECK(amount >= 0), currency text DEFAULT 'BOB', payment_date timestamptz DEFAULT now(),
 status text CHECK(status IN ('pending','completed','failed')) NOT NULL
);
CREATE TABLE IF NOT EXISTS incidents (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, description text NOT NULL, incident_date timestamptz DEFAULT now(),
 location text NOT NULL, severity_level text CHECK(severity_level IN ('low','medium','high')) NOT NULL,
 resolution_status text CHECK(resolution_status IN ('unresolved','resolved')) NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_logs (
 id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY, user_id bigint REFERENCES users(id) ON DELETE SET NULL,
 operation text NOT NULL, operation_date timestamptz DEFAULT now(), details text
);
