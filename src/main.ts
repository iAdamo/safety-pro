import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // CORS
  app.enableCors({
    origin: 'http://localhost:8081',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
