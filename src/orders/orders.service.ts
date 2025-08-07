import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { MenuItem } from '../entities/menu-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async findAll(restaurantId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { restaurantId },
      relations: ['orderItems', 'orderItems.menuItem', 'table', 'createdBy'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number, restaurantId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, restaurantId },
      relations: ['orderItems', 'orderItems.menuItem', 'table', 'createdBy']
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }

  async create(createOrderDto: any, restaurantId: number, userId: number): Promise<Order> {
    const { tableId, items, notes } = createOrderDto;

    // Generar número de orden único
    const orderNumber = await this.generateOrderNumber(restaurantId);

    // Calcular total
    let total = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const menuItem = await this.menuItemRepository.findOne({
        where: { id: item.menuItemId, restaurantId }
      });

      if (!menuItem) {
        throw new NotFoundException(`Elemento del menú ${item.menuItemId} no encontrado`);
      }

      if (!menuItem.isAvailable) {
        throw new NotFoundException(`Elemento del menú ${menuItem.name} no está disponible`);
      }

      const subtotal = Number(menuItem.price) * item.quantity;
      total += subtotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: Number(menuItem.price),
        subtotal,
        notes: item.notes
      });
    }

    // Crear la orden
    const order = this.orderRepository.create({
      orderNumber,
      tableId,
      restaurantId,
      createdById: userId,
      total,
      notes,
      status: OrderStatus.PENDING
    });

    const savedOrder = await this.orderRepository.save(order);

    // Crear los elementos de la orden
    for (const item of orderItems) {
      await this.orderItemRepository.save({
        ...item,
        orderId: savedOrder.id
      });
    }

    return this.findOne(savedOrder.id, restaurantId);
  }

  async updateStatus(id: number, status: OrderStatus, restaurantId: number): Promise<Order> {
    const order = await this.findOne(id, restaurantId);
    
    order.status = status;
    
    if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }
    
    return this.orderRepository.save(order);
  }

  async remove(id: number, restaurantId: number): Promise<void> {
    const order = await this.findOne(id, restaurantId);
    await this.orderRepository.remove(order);
  }

  async getStats(restaurantId: number) {
    const orders = await this.findAll(restaurantId);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(order => 
      new Date(order.createdAt) >= today
    );

    const totalSales = todayOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = todayOrders.length;
    const pendingOrders = orders.filter(order => 
      order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PREPARATION
    ).length;
    const completedOrders = orders.filter(order => 
      order.status === OrderStatus.DELIVERED
    ).length;

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      completedOrders,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
    };
  }

  private async generateOrderNumber(restaurantId: number): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    const lastOrder = await this.orderRepository.findOne({
      where: { restaurantId },
      order: { id: 'DESC' }
    });

    const sequence = lastOrder ? parseInt(lastOrder.orderNumber.slice(-4)) + 1 : 1;
    
    return `${dateStr}-${sequence.toString().padStart(4, '0')}`;
  }
}
