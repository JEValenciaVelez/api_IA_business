import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  tokenLimit: number;

  @Column({ type: 'int' })
  promptLimit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subscriptionPrice: number;
  
  @Column({ type: 'text' })
  subscriptionDescription: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // // Relación con User
  // @OneToMany(() => User, (user) => user.plan)
  // users: User[];
}
