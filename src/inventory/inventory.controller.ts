import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  async findAll(@Request() req) {
    return this.inventoryService.findAll(req.user.restaurantId);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.inventoryService.getStats(req.user.restaurantId);
  }

  @Get('low-stock')
  async getLowStockItems(@Request() req) {
    return this.inventoryService.getLowStockItems(req.user.restaurantId);
  }

  @Get('expiring')
  async getExpiringItems(
    @Query('days') days: string,
    @Request() req
  ) {
    return this.inventoryService.getExpiringItems(req.user.restaurantId, parseInt(days) || 30);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.inventoryService.findOne(+id, req.user.restaurantId);
  }

  @Post()
  async create(@Body() createInventoryItemDto: any, @Request() req) {
    return this.inventoryService.create(createInventoryItemDto, req.user.restaurantId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInventoryItemDto: any,
    @Request() req
  ) {
    return this.inventoryService.update(+id, updateInventoryItemDto, req.user.restaurantId);
  }

  @Put(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() body: { quantity: number },
    @Request() req
  ) {
    return this.inventoryService.updateStock(+id, body.quantity, req.user.restaurantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.inventoryService.remove(+id, req.user.restaurantId);
  }
}
