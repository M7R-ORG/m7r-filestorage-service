export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 8086,
  },
  storage: {
    path: process.env.STORAGE_PATH || '/data/files',
  },
});

export interface AppConfig {
  port: number;
}

export interface StorageConfig {
  path: string;
}

export interface Config {
  app: AppConfig;
  storage: StorageConfig;
}
