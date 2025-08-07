import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { LoginDto, RegisterRestaurantDto, RegisterEmployeeDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string, restaurantDomain: string): Promise<any> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { domain: restaurantDomain, isActive: true }
    });

    if (!restaurant) {
      throw new UnauthorizedException('Restaurante no encontrado o inactivo');
    }

    const user = await this.userRepository.findOne({
      where: { email, restaurantId: restaurant.id, isActive: true },
      relations: ['restaurant']
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(
      loginDto.email,
      loginDto.password,
      loginDto.restaurantDomain
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      restaurantId: user.restaurantId,
      restaurantDomain: user.restaurant.domain
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        restaurant: {
          id: user.restaurant.id,
          name: user.restaurant.name,
          domain: user.restaurant.domain,
          primaryColor: user.restaurant.primaryColor,
          secondaryColor: user.restaurant.secondaryColor
        }
      }
    };
  }

  async registerRestaurant(registerDto: RegisterRestaurantDto) {
    // Verificar si el dominio ya existe
    const existingRestaurant = await this.restaurantRepository.findOne({
      where: { domain: registerDto.domain }
    });

    if (existingRestaurant) {
      throw new ConflictException('El dominio del restaurante ya está registrado');
    }

    // Verificar si el email del admin ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.adminEmail }
    });

    if (existingUser) {
      throw new ConflictException('El email del administrador ya está registrado');
    }

    // Crear el restaurante
    const restaurant = this.restaurantRepository.create({
      name: registerDto.restaurantName,
      description: registerDto.description,
      domain: registerDto.domain,
      address: registerDto.address,
      phone: registerDto.phone,
      email: registerDto.email
    });

    const savedRestaurant = await this.restaurantRepository.save(restaurant);

    // Crear el usuario administrador
    const hashedPassword = await bcrypt.hash(registerDto.adminPassword, 10);
    const adminUser = this.userRepository.create({
      name: registerDto.adminName,
      email: registerDto.adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      position: 'Administrador',
      restaurantId: savedRestaurant.id
    });

    await this.userRepository.save(adminUser);

    return {
      message: 'Restaurante registrado exitosamente',
      restaurant: {
        id: savedRestaurant.id,
        name: savedRestaurant.name,
        domain: savedRestaurant.domain
      }
    };
  }

  async registerEmployee(registerDto: RegisterEmployeeDto, restaurantId: number) {
    // Verificar si el email ya existe en el restaurante
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email, restaurantId }
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado en este restaurante');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const employee = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      restaurantId
    });

    const savedEmployee = await this.userRepository.save(employee);

    const { password, ...result } = savedEmployee;
    return result;
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
