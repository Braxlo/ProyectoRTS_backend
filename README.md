# Sistema de Gestión de Restaurantes - Backend

Backend completo para el sistema de gestión de restaurantes desarrollado con NestJS, TypeORM y MySQL.

## 🚀 Características

- **Autenticación JWT** con roles de administrador y empleado
- **Sistema multi-tenant** por restaurante con dominios personalizados
- **Gestión de mesas** con estados (disponible, ocupada, reservada, limpieza)
- **Gestión de menú** con categorías y disponibilidad
- **Sistema de órdenes** con estados y seguimiento
- **Control de inventario** con alertas de stock bajo
- **Personalización de colores** por restaurante
- **API REST** completa con documentación Swagger
- **Validación de datos** con class-validator
- **Base de datos MySQL** con TypeORM

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
   git clone <repository-url>
   cd backend
```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=tu_password
   DB_DATABASE=restaurant_management
   JWT_SECRET=tu-super-secret-jwt-key
   PORT=3001
   NODE_ENV=development
   ```

4. **Crear la base de datos**
   ```sql
   CREATE DATABASE restaurant_management;
   ```

5. **Ejecutar migraciones y seed**
   ```bash
   npm run db:reset
   ```

## 🚀 Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## 📚 Documentación API

Una vez que el servidor esté corriendo, la documentación Swagger estará disponible en:
```
http://localhost:3001/api
```

## 🔐 Autenticación

### Registro de Restaurante
```http
POST /auth/register/restaurant
Content-Type: application/json

{
  "restaurantName": "Don Justo",
  "description": "Restaurante de comida italiana",
  "domain": "DonJusto",
  "address": "Calle Principal 123",
  "phone": "+1234567890",
  "email": "info@donjusto.com",
  "adminName": "Administrador",
  "adminEmail": "admin@DonJusto.com",
  "adminPassword": "admin123"
}
```

### Login de Empleado
```http
POST /auth/login
Content-Type: application/json

{
  "email": "pedro@DonJusto.com",
  "password": "pedro123",
  "restaurantDomain": "DonJusto"
}
```

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                 # Autenticación y autorización
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── local.strategy.ts
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── auth.module.ts
├── entities/            # Entidades de TypeORM
│   ├── user.entity.ts
│   ├── restaurant.entity.ts
│   ├── table.entity.ts
│   ├── menu-item.entity.ts
│   ├── order.entity.ts
│   ├── order-item.entity.ts
│   └── inventory-item.entity.ts
├── dto/                 # Data Transfer Objects
│   └── auth.dto.ts
├── restaurants/         # Gestión de restaurantes
├── tables/             # Gestión de mesas
├── menu/               # Gestión de menú
├── orders/             # Gestión de órdenes
├── inventory/          # Gestión de inventario
├── database/           # Scripts de base de datos
│   └── seed.ts
├── app.module.ts       # Módulo principal
└── main.ts            # Punto de entrada
```

## 🔧 Scripts Disponibles

- `npm run start:dev` - Ejecutar en modo desarrollo con hot reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar en modo producción
- `npm run seed` - Poblar la base de datos con datos de ejemplo
- `npm run db:reset` - Reconstruir y poblar la base de datos
- `npm run lint` - Ejecutar linter
- `npm run test` - Ejecutar tests

## 📊 Endpoints Principales

### Autenticación
- `POST /auth/login` - Login de usuarios
- `POST /auth/register/restaurant` - Registro de restaurante
- `POST /auth/register/employee` - Registro de empleado (requiere admin)
- `PUT /auth/change-password` - Cambiar contraseña
- `GET /auth/profile` - Obtener perfil del usuario

### Restaurantes
- `GET /restaurants/profile` - Obtener perfil del restaurante
- `GET /restaurants/dashboard/stats` - Estadísticas del dashboard
- `PUT /restaurants/colors` - Actualizar colores del restaurante
- `PUT /restaurants/settings` - Actualizar configuración

### Mesas
- `GET /tables` - Listar todas las mesas
- `POST /tables` - Crear nueva mesa
- `PUT /tables/:id` - Actualizar mesa
- `PUT /tables/:id/status` - Cambiar estado de mesa
- `DELETE /tables/:id` - Eliminar mesa
- `GET /tables/stats` - Estadísticas de mesas

### Menú
- `GET /menu` - Listar elementos del menú
- `POST /menu` - Crear elemento del menú
- `PUT /menu/:id` - Actualizar elemento del menú
- `PUT /menu/:id/toggle-availability` - Cambiar disponibilidad
- `PUT /menu/:id/toggle-featured` - Cambiar destacado
- `DELETE /menu/:id` - Eliminar elemento del menú
- `GET /menu/stats` - Estadísticas del menú

### Órdenes
- `GET /orders` - Listar todas las órdenes
- `POST /orders` - Crear nueva orden
- `PUT /orders/:id/status` - Cambiar estado de orden
- `DELETE /orders/:id` - Eliminar orden
- `GET /orders/stats` - Estadísticas de órdenes

### Inventario
- `GET /inventory` - Listar elementos del inventario
- `POST /inventory` - Crear elemento del inventario
- `PUT /inventory/:id` - Actualizar elemento del inventario
- `PUT /inventory/:id/stock` - Actualizar stock
- `DELETE /inventory/:id` - Eliminar elemento del inventario
- `GET /inventory/stats` - Estadísticas del inventario
- `GET /inventory/low-stock` - Elementos con stock bajo
- `GET /inventory/expiring` - Elementos próximos a vencer

## 🔒 Seguridad

- **JWT Tokens** para autenticación
- **Roles y permisos** (admin/employee)
- **Validación de datos** con class-validator
- **CORS** configurado para desarrollo
- **Contraseñas hasheadas** con bcrypt

## 🗄️ Base de Datos

El sistema utiliza MySQL con las siguientes tablas principales:

- `users` - Usuarios del sistema
- `restaurants` - Información de restaurantes
- `tables` - Mesas del restaurante
- `menu_items` - Elementos del menú
- `orders` - Órdenes de clientes
- `order_items` - Elementos de las órdenes
- `inventory_items` - Elementos del inventario

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:cov

# Ejecutar tests en modo watch
npm run test:watch
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo.
