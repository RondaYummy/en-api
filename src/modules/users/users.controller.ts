import { Controller, Body, Patch, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserId } from '../../decorators/user-id.decorator';
import { Permissions } from 'src/decorators/session-permissions.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  @Permissions()
  async get(@UserId() userId: string) {
    return await this.usersService.find({ userId });
  }

  @Patch()
  @Permissions()
  async update(@UserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(userId, updateUserDto);
  }
}
