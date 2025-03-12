import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Proccess {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    prompt: string;

    @Column({ type: 'text' })
    response: string;

    @Column({ type: 'boolean' })
    match: boolean;

    @Column({ type: 'int' })
    userId: number;

    // @ManyToOne(() => User)
    // @JoinColumn({ name: 'userId' })
    // user: User;

    @Column({ type: 'text' })
    query: string;

    // @ManyToOne(() => Query)
    // @JoinColumn({ name: 'queryId' })
    // query: Query;

    @Column({ type: 'jsonb', nullable: true })
    metadata: object | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}