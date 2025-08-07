import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Table } from './table.entity';
import { MenuItem } from './menu-item.entity';
import { Order } from './order.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  description: string;

  @Column({ length: 100, unique: true })
  domain: string;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 7, default: '#3B82F6' })
  primaryColor: string;

  @Column({ length: 7, default: '#1E40AF' })
  secondaryColor: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => User, user => user.restaurant)
  users: User[];

  @OneToMany(() => Table, table => table.restaurant)
  tables: Table[];

  @OneToMany(() => MenuItem, menuItem => menuItem.restaurant)
  menuItems: MenuItem[];

  @OneToMany(() => Order, order => order.restaurant)
  orders: Order[];

  @OneToMany(() => InventoryItem, inventoryItem => inventoryItem.restaurant)
  inventoryItems: InventoryItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
