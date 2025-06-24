import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Splitwise-clone')
    .setDescription('API for managing group expenses')
    .setVersion('1.0')
    .addBearerAuth() // for JWT if used
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // http://localhost:3000/docs
  console.log(new Date().toISOString());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
