import { randomUUID } from 'crypto';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModuleAsyncParams } from 'nestjs-pino';
import pino from 'pino';

export const pinoConfig: LoggerModuleAsyncParams = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const NODE_ENV = configService.get('NODE_ENV');

    return {
      pinoHttp: {
        serializers: {
          req: pino.stdSerializers.wrapRequestSerializer((req) => {
            return {
              id: req.raw.id,
              method: req.raw.method,
              path: req.raw.url,
              headers: {
                host: req.raw.headers.host,
                'user-agent': req.raw.headers['user-agent'],
                referer: req.raw.headers.referer,
              },
            };
          }),
        },
        timestamp: () => `, "timestamp":"${new Date().toISOString()}"`,
        genReqId: (req, res) => {
          let requestId = req.headers['x-request-id'];
          if (requestId) return requestId;

          requestId = randomUUID();
          res.setHeader('x-request-id', requestId);

          return requestId;
        },
        level: NODE_ENV === 'development' ? 'debug' : 'info',
        transport: NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
      },
    };
  },
};
