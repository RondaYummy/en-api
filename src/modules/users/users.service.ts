import { Injectable } from '@nestjs/common';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  find(findUserDto: FindUserDto) {
    return this.usersRepository.find(findUserDto.userId);
  }

  findCredentials(username: string) {
    return this.usersRepository.findCredentials(username);
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(userId, updateUserDto);
  }
}
