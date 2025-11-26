import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'int' })
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'job_title', nullable: true })
  job_title?: string;

  @Column({ length: 10, default: 'vi' })
  language: string;

  @Column({ name: 'theme_mode', length: 10, default: 'light' })
  theme_mode: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}

