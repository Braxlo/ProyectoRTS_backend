import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.restaurantsService.findOne(req.user.restaurantId);
  }

  @Get('dashboard/stats')
  async getDashboardStats(@Request() req) {
    return this.restaurantsService.getDashboardStats(req.user.restaurantId);
  }

  @Put('colors')
  async updateColors(
    @Body() body: { primaryColor: string; secondaryColor: string },
    @Request() req
  ) {
    return this.restaurantsService.updateColors(
      req.user.restaurantId,
      body.primaryColor,
      body.secondaryColor
    );
  }

  @Put('settings')
  async updateSettings(
    @Body() updateData: any,
    @Request() req
  ) {
    return this.restaurantsService.updateSettings(req.user.restaurantId, updateData);
  }
}
