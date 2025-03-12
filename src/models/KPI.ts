import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class KPI {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'int' })
  idUser: number;

  @Column({ type: 'float' })
  value: number;
  
  @Column({ type: 'text' })
  period: string;
  
  @Column({ type: 'text', nullable: true })
  region?: string;
  
  @Column({ type: 'text', nullable: true })
  productCategory?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // // Relación con User
  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'idUser' })
  // user: User;
}
