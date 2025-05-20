import { RequestLog } from '../entities/RequestLog';

export interface RequestLogRepository {
  save(log: RequestLog): Promise<void>;
} 