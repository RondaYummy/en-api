import { Controller, Body, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserId } from '../../decorators/user-id.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Patch()
  update(@UserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }
}
