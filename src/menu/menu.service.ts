import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem, MenuCategory } from '../entities/menu-item.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async findAll(restaurantId: number): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { restaurantId },
      order: { category: 'ASC', name: 'ASC' }
    });
  }

  async findOne(id: number, restaurantId: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id, restaurantId }
    });

    if (!menuItem) {
      throw new NotFoundException('Elemento del menú no encontrado');
    }

    return menuItem;
  }

  async create(createMenuItemDto: any, restaurantId: number): Promise<MenuItem> {
    const menuItem = new MenuItem();
    Object.assign(menuItem, createMenuItemDto);
    menuItem.restaurantId = restaurantId;

    return this.menuItemRepository.save(menuItem);
  }

  async update(id: number, updateMenuItemDto: any, restaurantId: number): Promise<MenuItem> {
    const menuItem = await this.findOne(id, restaurantId);
    
    Object.assign(menuItem, updateMenuItemDto);
    
    return this.menuItemRepository.save(menuItem);
  }

  async remove(id: number, restaurantId: number): Promise<void> {
    const menuItem = await this.findOne(id, restaurantId);
    await this.menuItemRepository.remove(menuItem);
  }

  async toggleAvailability(id: number, restaurantId: number): Promise<MenuItem> {
    const menuItem = await this.findOne(id, restaurantId);
    
    menuItem.isAvailable = !menuItem.isAvailable;
    
    return this.menuItemRepository.save(menuItem);
  }

  async toggleFeatured(id: number, restaurantId: number): Promise<MenuItem> {
    const menuItem = await this.findOne(id, restaurantId);
    
    menuItem.isFeatured = !menuItem.isFeatured;
    
    return this.menuItemRepository.save(menuItem);
  }

  async findByCategory(category: MenuCategory, restaurantId: number): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { category, restaurantId, isAvailable: true },
      order: { name: 'ASC' }
    });
  }

  async getStats(restaurantId: number) {
    const menuItems = await this.findAll(restaurantId);
    
    const total = menuItems.length;
    const available = menuItems.filter(item => item.isAvailable).length;
    const featured = menuItems.filter(item => item.isFeatured).length;
    
    const categories = Object.values(MenuCategory);
    const categoryStats = categories.map(category => ({
      category,
      count: menuItems.filter(item => item.category === category).length
    }));

    const totalValue = menuItems.reduce((sum, item) => sum + Number(item.price), 0);

    return {
      total,
      available,
      featured,
      categories: categoryStats,
      totalValue
    };
  }
}
