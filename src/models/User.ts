import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role";
import { Plan } from "./Plan";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    fullName: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'int' })
    planId: number;

    @Column({ type: 'boolean', default: true })
    hasPaidSubscription: boolean;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastLoginAt: Date | null;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profilePictureUrl: string | null;

    @Column({ type: 'jsonb', nullable: true })
    preferences: Record<string, unknown> | null;

    // New fields for role relation
    @Column({ type: 'int' })
    roleId: number;

    // @ManyToOne(() => Plan)
    // @JoinColumn({ name: 'planId' })
    // Plan: Plan;

    // @ManyToOne(() => Role)
    // @JoinColumn({ name: 'roleId' })
    // role: Role;
}