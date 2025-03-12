import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User"; 

@Entity()
export class MessageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'enum', enum: ['system', 'user'] })
  messageType: 'system' | 'user';

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object | null;

  @Column({ type: 'boolean', default: false })
  isProcessed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'userId' })
  // user: User;

}