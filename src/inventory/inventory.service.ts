import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem, InventoryUnit } from '../entities/inventory-item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async findAll(restaurantId: number): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.find({
      where: { restaurantId, isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number, restaurantId: number): Promise<InventoryItem> {
    const inventoryItem = await this.inventoryItemRepository.findOne({
      where: { id, restaurantId, isActive: true }
    });

    if (!inventoryItem) {
      throw new NotFoundException('Elemento del inventario no encontrado');
    }

    return inventoryItem;
  }

  async create(createInventoryItemDto: any, restaurantId: number): Promise<InventoryItem> {
    const inventoryItem = new InventoryItem();
    Object.assign(inventoryItem, createInventoryItemDto);
    inventoryItem.restaurantId = restaurantId;

    return this.inventoryItemRepository.save(inventoryItem);
  }

  async update(id: number, updateInventoryItemDto: any, restaurantId: number): Promise<InventoryItem> {
    const inventoryItem = await this.findOne(id, restaurantId);
    
    Object.assign(inventoryItem, updateInventoryItemDto);
    
    return this.inventoryItemRepository.save(inventoryItem);
  }

  async remove(id: number, restaurantId: number): Promise<void> {
    const inventoryItem = await this.findOne(id, restaurantId);
    inventoryItem.isActive = false;
    await this.inventoryItemRepository.save(inventoryItem);
  }

  async updateStock(id: number, quantity: number, restaurantId: number): Promise<InventoryItem> {
    const inventoryItem = await this.findOne(id, restaurantId);
    
    inventoryItem.currentStock = quantity;
    
    return this.inventoryItemRepository.save(inventoryItem);
  }

  async getLowStockItems(restaurantId: number): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.find({
      where: { restaurantId, isActive: true },
      order: { currentStock: 'ASC' }
    });
  }

  async getExpiringItems(restaurantId: number, days: number = 30): Promise<InventoryItem[]> {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return this.inventoryItemRepository.find({
      where: {
        restaurantId,
        isActive: true,
        expirationDate: date
      },
      order: { expirationDate: 'ASC' }
    });
  }

  async getStats(restaurantId: number) {
    const items = await this.findAll(restaurantId);
    
    const total = items.length;
    const lowStock = items.filter(item => item.currentStock <= item.minimumStock).length;
    const outOfStock = items.filter(item => item.currentStock === 0).length;
    const expiringSoon = items.filter(item => {
      if (!item.expirationDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    }).length;

    const totalValue = items.reduce((sum, item) => {
      return sum + (Number(item.unitPrice || 0) * Number(item.currentStock));
    }, 0);

    return {
      total,
      lowStock,
      outOfStock,
      expiringSoon,
      totalValue
    };
  }
}
