import { Controller, Post, Body, UseGuards, Get, Request, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterRestaurantDto, RegisterEmployeeDto, ChangePasswordDto } from '../dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register/restaurant')
  async registerRestaurant(@Body() registerDto: RegisterRestaurantDto) {
    return this.authService.registerRestaurant(registerDto);
  }

  @Post('register/employee')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async registerEmployee(
    @Body() registerDto: RegisterEmployeeDto,
    @Request() req
  ) {
    return this.authService.registerEmployee(registerDto, req.user.restaurantId);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req
  ) {
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
