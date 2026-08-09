import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/app.config';
import { FilesModule } from './files/files.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    FilesModule,
    HealthModule,
  ],
})
export class AppModule {}
