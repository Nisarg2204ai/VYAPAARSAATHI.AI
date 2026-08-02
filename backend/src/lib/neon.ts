import { env } from '../config/env.js';

export interface NeonDbConfig {
  connectionString?: string;
}

export class NeonClient {
  private connectionString: string | undefined;

  constructor(config?: NeonDbConfig) {
    this.connectionString = config?.connectionString || process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  }

  public isConnected(): boolean {
    return Boolean(this.connectionString);
  }

  public getConnectionString(): string | undefined {
    return this.connectionString;
  }
}

export const neonClient = new NeonClient();
