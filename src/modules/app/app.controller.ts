import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/session-permissions.decorator.ts';

@ApiTags('App')
@Controller()
export class AppController {
  constructor() { }

  @Get('app')
  @Permissions()
  app() {
    return 'APP WORKS';
  }
}
