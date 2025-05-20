import { DataSource } from 'typeorm';
import { RequestLog } from '../../domain/entities/RequestLog';
import { RequestLogRepository } from '../../domain/ports/RequestLogRepository';
import { RequestLogEntity } from '../entities/RequestLogEntity';

export class SqliteRequestLogRepository implements RequestLogRepository {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
      logging: false,
      entities: [RequestLogEntity],
    });
  }

  async initialize(): Promise<void> {
    await this.dataSource.initialize();
  }

  async save(log: RequestLog): Promise<void> {
    const repository = this.dataSource.getRepository(RequestLogEntity);
    const entity = new RequestLogEntity();
    Object.assign(entity, log);
    await repository.save(entity);
  }
} 