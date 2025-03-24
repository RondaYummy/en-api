import { Injectable } from '@nestjs/common';
import { Drizzle, InjectDrizzle } from 'src/modules/drizzle/drizzle.module';
import { userSessions } from './entities/user_sessions';
import { UserSessionDto } from './dto/user_session.dto';

@Injectable()
export class UserSessionsRepository {
  constructor(@InjectDrizzle() private readonly db: Drizzle) { }

  async create(createUserSession: UserSessionDto): Promise<UserSessionDto> {
    const [insertedUser] = await this.db
      .insert(userSessions)
      .values(createUserSession)
      .returning();
    return insertedUser;
  }
}
