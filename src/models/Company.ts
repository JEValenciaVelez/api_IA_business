import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  databaseUsername: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ type: 'varchar', length: 255 })
  databaseName: string;

  @Column('json', { nullable: true })
  databaseSchema: {
    database: string;
    tables: {
      [nombreTabla: string]: {
        description: string;
        attributes: { [nombreAtributo: string]: string };
      };
    };
  }; // Estructura para guardar el esquema de la base de datos con tablas y sus atributos


  @Column({ type: 'varchar', length: 255 })
  databasePassword: string;

  @Column({ type: 'varchar', length: 255 })
  dbm: string;

  @Column({ type: 'bigint', nullable: true })
  nit: number | null;

  @Column({ type: 'varchar', length: 255 })
  databaseHost: string;

  // @ManyToOne(() => User) 
  // @JoinColumn({ name: 'externalUserId' })
  // externalUser: User;

  // @ManyToOne(() => KPI) 
  // @JoinColumn({ name: 'externalUserId' })
  // externalUser: User;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'int'})
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}