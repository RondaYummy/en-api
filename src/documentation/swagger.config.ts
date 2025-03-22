import { INestApplication } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

export function useSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Delivery API Documentation')
    .setDescription('This is documentation for Delivery API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: `<p>Bearer token is required to access any protected route.
          <p>In order to obtain one, please, use the <code>POST /login</code> end-point with your user credentials`,
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
