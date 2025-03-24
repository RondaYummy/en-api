import { PartialType, PickType } from '@nestjs/swagger';

import { RegisterDto } from '../../auth/dto/register.dto';

export class UpdateUserDto extends PartialType(PickType(RegisterDto, ['first_name', 'last_name'] as const)) { }
