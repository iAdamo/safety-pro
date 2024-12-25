import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set Global Prefix
  app.setGlobalPrefix('api');

  // Enable Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Safety Pro')
    .setDescription('The Safety Pro API description')
    .setVersion('1.0')
    .addTag('safety-pro')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  // Use cookie-parser middleware
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: ['http://localhost:8081', 'https://r1w17jd5-3000.uks1.devtunnels.ms/'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
