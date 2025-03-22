import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async find(userId: string) {
    return await this.usersRepository.findOne({ where: { userId } });
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(userId, updateUserDto);
    return await this.find(userId);
  }
}
