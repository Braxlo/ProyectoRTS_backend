import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

export enum InventoryUnit {
  KG = 'kg',
  GRAMS = 'grams',
  LITERS = 'liters',
  UNITS = 'units',
  PACKAGES = 'packages'
}

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  currentStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minimumStock: number;

  @Column({
    type: 'enum',
    enum: InventoryUnit
  })
  unit: InventoryUnit;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ type: 'text', nullable: true })
  supplier: string;

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Restaurant, restaurant => restaurant.inventoryItems)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
