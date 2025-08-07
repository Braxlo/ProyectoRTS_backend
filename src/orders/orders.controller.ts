import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderStatus } from '../entities/order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async findAll(@Request() req) {
    return this.ordersService.findAll(req.user.restaurantId);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.ordersService.getStats(req.user.restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(+id, req.user.restaurantId);
  }

  @Post()
  async create(@Body() createOrderDto: any, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.restaurantId, req.user.id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
    @Request() req
  ) {
    return this.ordersService.updateStatus(+id, body.status, req.user.restaurantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.ordersService.remove(+id, req.user.restaurantId);
  }
}
