import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table, TableStatus } from '../entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
  ) {}

  async findAll(restaurantId: number): Promise<Table[]> {
    return this.tableRepository.find({
      where: { restaurantId },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number, restaurantId: number): Promise<Table> {
    const table = await this.tableRepository.findOne({
      where: { id, restaurantId }
    });

    if (!table) {
      throw new NotFoundException('Mesa no encontrada');
    }

    return table;
  }

  async create(createTableDto: any, restaurantId: number): Promise<Table> {
    const table = new Table();
    Object.assign(table, createTableDto);
    table.restaurantId = restaurantId;

    return this.tableRepository.save(table);
  }

  async update(id: number, updateTableDto: any, restaurantId: number): Promise<Table> {
    const table = await this.findOne(id, restaurantId);
    
    Object.assign(table, updateTableDto);
    
    return this.tableRepository.save(table);
  }

  async remove(id: number, restaurantId: number): Promise<void> {
    const table = await this.findOne(id, restaurantId);
    await this.tableRepository.remove(table);
  }

  async updateStatus(id: number, status: TableStatus, restaurantId: number): Promise<Table> {
    const table = await this.findOne(id, restaurantId);
    
    table.status = status;
    
    return this.tableRepository.save(table);
  }

  async getStats(restaurantId: number) {
    const tables = await this.findAll(restaurantId);
    
    const total = tables.length;
    const available = tables.filter(table => table.status === TableStatus.AVAILABLE).length;
    const occupied = tables.filter(table => table.status === TableStatus.OCCUPIED).length;
    const reserved = tables.filter(table => table.status === TableStatus.RESERVED).length;
    const cleaning = tables.filter(table => table.status === TableStatus.CLEANING).length;

    return {
      total,
      available,
      occupied,
      reserved,
      cleaning,
      occupancyRate: total > 0 ? (occupied / total) * 100 : 0
    };
  }
}
