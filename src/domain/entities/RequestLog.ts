export interface RequestLog {
  id?: number;
  franchise: string;
  version: string;
  metadata: Record<string, any>;
  timestamp: Date;
  status: 'success' | 'fail';
  errorMessage?: string;
} 