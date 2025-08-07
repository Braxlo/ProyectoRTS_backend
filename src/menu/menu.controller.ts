import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MenuCategory } from '../entities/menu-item.entity';

@Controller('menu')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  async findAll(@Request() req) {
    return this.menuService.findAll(req.user.restaurantId);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.menuService.getStats(req.user.restaurantId);
  }

  @Get('category/:category')
  async findByCategory(
    @Param('category') category: MenuCategory,
    @Request() req
  ) {
    return this.menuService.findByCategory(category, req.user.restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.menuService.findOne(+id, req.user.restaurantId);
  }

  @Post()
  async create(@Body() createMenuItemDto: any, @Request() req) {
    return this.menuService.create(createMenuItemDto, req.user.restaurantId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: any,
    @Request() req
  ) {
    return this.menuService.update(+id, updateMenuItemDto, req.user.restaurantId);
  }

  @Put(':id/toggle-availability')
  async toggleAvailability(@Param('id') id: string, @Request() req) {
    return this.menuService.toggleAvailability(+id, req.user.restaurantId);
  }

  @Put(':id/toggle-featured')
  async toggleFeatured(@Param('id') id: string, @Request() req) {
    return this.menuService.toggleFeatured(+id, req.user.restaurantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.menuService.remove(+id, req.user.restaurantId);
  }
}
