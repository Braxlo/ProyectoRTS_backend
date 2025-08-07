import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { TablesService } from '../tables/tables.service';
import { MenuService } from '../menu/menu.service';
import { InventoryService } from '../inventory/inventory.service';
import { MenuCategory } from '../entities/menu-item.entity';
import { InventoryUnit } from '../entities/inventory-item.entity';
import { UserRole } from '../entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const authService = app.get(AuthService);
  const tablesService = app.get(TablesService);
  const menuService = app.get(MenuService);
  const inventoryService = app.get(InventoryService);

  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    // 1. Crear restaurante de ejemplo
    const restaurantData = {
      restaurantName: 'Don Justo',
      description: 'Restaurante de comida italiana tradicional',
      domain: 'DonJusto',
      address: 'Calle Principal 123, Ciudad',
      phone: '+1234567890',
      email: 'info@donjusto.com',
      adminName: 'Administrador',
      adminEmail: 'admin@DonJusto.com',
      adminPassword: 'admin123'
    };

    const restaurant = await authService.registerRestaurant(restaurantData);
    console.log('✅ Restaurante creado:', restaurant.restaurant.name);

    // 2. Crear empleados de ejemplo
    const employees = [
      {
        name: 'Pedro García',
        email: 'pedro@DonJusto.com',
        password: 'pedro123',
        position: 'Chef',
        role: UserRole.EMPLOYEE
      },
      {
        name: 'María López',
        email: 'maria@DonJusto.com',
        password: 'maria123',
        position: 'Mesera',
        role: UserRole.EMPLOYEE
      }
    ];

    for (const employee of employees) {
      await authService.registerEmployee(employee, restaurant.restaurant.id);
      console.log('✅ Empleado creado:', employee.name);
    }

    // 3. Crear mesas de ejemplo
    const tables = [
      { name: 'Mesa 1', capacity: 4 },
      { name: 'Mesa 2', capacity: 4 },
      { name: 'Mesa 3', capacity: 6 },
      { name: 'Mesa 4', capacity: 2 },
      { name: 'Mesa 5', capacity: 8 },
      { name: 'Mesa 6', capacity: 4 }
    ];

    for (const table of tables) {
      await tablesService.create(table, restaurant.restaurant.id);
    }
    console.log('✅ Mesas creadas');

    // 4. Crear elementos del menú
    const menuItems = [
      {
        name: 'Pasta Carbonara',
        description: 'Pasta con salsa cremosa, panceta y queso parmesano',
        price: 15.99,
        category: MenuCategory.MAIN_COURSE,
        preparationTime: 20,
        ingredients: ['Pasta', 'Huevos', 'Panceta', 'Queso Parmesano', 'Pimienta Negra']
      },
      {
        name: 'Ensalada César',
        description: 'Lechuga romana, crutones, queso parmesano y aderezo César',
        price: 12.50,
        category: MenuCategory.APPETIZER,
        preparationTime: 10,
        ingredients: ['Lechuga Romana', 'Crutones', 'Queso Parmesano', 'Aderezo César']
      },
      {
        name: 'Pizza Margherita',
        description: 'Pizza tradicional con tomate, mozzarella y albahaca',
        price: 18.99,
        category: MenuCategory.MAIN_COURSE,
        preparationTime: 25,
        ingredients: ['Masa de Pizza', 'Salsa de Tomate', 'Mozzarella', 'Albahaca']
      },
      {
        name: 'Tiramisú',
        description: 'Postre italiano con café, mascarpone y cacao',
        price: 7.99,
        category: MenuCategory.DESSERT,
        preparationTime: 15,
        ingredients: ['Huevos', 'Azúcar', 'Mascarpone', 'Café', 'Cacao']
      }
    ];

    for (const item of menuItems) {
      await menuService.create(item, restaurant.restaurant.id);
    }
    console.log('✅ Elementos del menú creados');

    // 5. Crear elementos del inventario
    const inventoryItems = [
      {
        name: 'Pasta',
        description: 'Pasta italiana de alta calidad',
        currentStock: 50,
        minimumStock: 10,
        unit: InventoryUnit.KG,
        unitPrice: 2.50,
        supplier: 'Proveedor Italiano'
      },
      {
        name: 'Queso Parmesano',
        description: 'Queso parmesano auténtico',
        currentStock: 5,
        minimumStock: 2,
        unit: InventoryUnit.KG,
        unitPrice: 15.00,
        supplier: 'Lácteos Premium'
      },
      {
        name: 'Huevos',
        description: 'Huevos frescos de granja',
        currentStock: 100,
        minimumStock: 20,
        unit: InventoryUnit.UNITS,
        unitPrice: 0.30,
        supplier: 'Granja Local'
      },
      {
        name: 'Lechuga Romana',
        description: 'Lechuga romana fresca',
        currentStock: 8,
        minimumStock: 3,
        unit: InventoryUnit.KG,
        unitPrice: 1.50,
        supplier: 'Verduras Frescas'
      }
    ];

    for (const item of inventoryItems) {
      await inventoryService.create(item, restaurant.restaurant.id);
    }
    console.log('✅ Elementos del inventario creados');

    console.log('🎉 Seed completado exitosamente!');
    console.log('📧 Credenciales de acceso:');
    console.log('   Admin: admin@DonJusto.com / admin123');
    console.log('   Empleado: pedro@DonJusto.com / pedro123');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await app.close();
  }
}

seed();
