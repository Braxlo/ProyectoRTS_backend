import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TableStatus } from '../entities/table.entity';

@Controller('tables')
@UseGuards(JwtAuthGuard)
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @Get()
  async findAll(@Request() req) {
    return this.tablesService.findAll(req.user.restaurantId);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.tablesService.getStats(req.user.restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.tablesService.findOne(+id, req.user.restaurantId);
  }

  @Post()
  async create(@Body() createTableDto: any, @Request() req) {
    return this.tablesService.create(createTableDto, req.user.restaurantId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTableDto: any,
    @Request() req
  ) {
    return this.tablesService.update(+id, updateTableDto, req.user.restaurantId);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: TableStatus },
    @Request() req
  ) {
    return this.tablesService.updateStatus(+id, body.status, req.user.restaurantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.tablesService.remove(+id, req.user.restaurantId);
  }
}
