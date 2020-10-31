import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from './common/filters/query-failed-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new QueryFailedExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('Clinic')
    .setDescription('The Clinic API description')
    .setVersion('1.0')
    .addTag('doctor')
    .addTag('patient')
    .addTag('work-time')
    .addTag('appointment')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
