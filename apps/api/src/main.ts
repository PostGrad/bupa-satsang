import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { HealthController } from './health.controller.js';

@Module({
  controllers: [HealthController]
})
class AppModule {}

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const app = await NestFactory.create(AppModule);

await app.listen(port, '0.0.0.0');
