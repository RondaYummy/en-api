import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users', schema: process.env.DB_SCHEMA })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id', primaryKeyConstraintName: 'pk_user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 64, name: 'first_name', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 64, name: 'last_name', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 32, name: 'username', nullable: false, select: false, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 128, name: 'hash', nullable: false, select: false })
  hash: string;

  @Column({ type: 'varchar', length: 32, name: 'salt', nullable: false, select: false })
  salt: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
