import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RequestLogEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  franchise!: string;

  @Column()
  version!: string;

  @Column('simple-json')
  metadata!: Record<string, any>;

  @Column()
  timestamp!: Date;

  @Column()
  status!: 'success' | 'fail';

  @Column({ nullable: true })
  errorMessage?: string;
} 