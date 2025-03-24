import { Injectable } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Drizzle, InjectDrizzle } from '../drizzle/drizzle.module';
import { users } from './entities/users.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectDrizzle() private readonly db: Drizzle) { }

  async create(createUserDto: CreateUserDto) {
    const [insertedUser] = await this.db
      .insert(users)
      .values(createUserDto)
      .returning();
    return insertedUser;
  }

  async find(userId: string) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    return result[0];
  }

  async findCredentials(username: string): Promise<Pick<any, 'user_id' | 'hash' | 'salt'> | null> {
    const result = await this.db
      .select({
        user_id: users.id,
        hash: users.hash,
        salt: users.salt,
      })
      .from(users)
      .where(and(eq(users.username, username), isNull(users.deleted_at)));
    return result[0] || null;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    await this.db
      .update(users)
      .set(updateUserDto)
      .where(eq(users.id, userId));
    return this.find(userId);
  }
}
