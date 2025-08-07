import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id, isActive: true },
      relations: ['users', 'tables', 'menuItems', 'orders', 'inventoryItems']
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    return restaurant;
  }

  async findByDomain(domain: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { domain, isActive: true }
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    return restaurant;
  }

  async updateColors(id: number, primaryColor: string, secondaryColor: string): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    
    restaurant.primaryColor = primaryColor;
    restaurant.secondaryColor = secondaryColor;
    
    return this.restaurantRepository.save(restaurant);
  }

  async updateSettings(id: number, updateData: Partial<Restaurant>): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    
    Object.assign(restaurant, updateData);
    
    return this.restaurantRepository.save(restaurant);
  }

  async getDashboardStats(id: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['tables', 'orders', 'menuItems', 'inventoryItems']
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = restaurant.orders.filter(order => 
      new Date(order.createdAt) >= today
    );

    const totalSales = todayOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const pendingOrders = restaurant.orders.filter(order => 
      order.status === 'pending' || order.status === 'in_preparation'
    ).length;

    const occupiedTables = restaurant.tables.filter(table => 
      table.status === 'occupied'
    ).length;

    const lowStockItems = restaurant.inventoryItems.filter(item => 
      item.currentStock <= item.minimumStock
    ).length;

    return {
      totalSales,
      totalOrders: todayOrders.length,
      pendingOrders,
      occupiedTables,
      totalTables: restaurant.tables.length,
      lowStockItems,
      totalMenuItems: restaurant.menuItems.length,
      availableMenuItems: restaurant.menuItems.filter(item => item.isAvailable).length
    };
  }
}
