import { INestApplication } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

export function useSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('English AI Documentation')
    .setDescription('This is documentation for English AI')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
