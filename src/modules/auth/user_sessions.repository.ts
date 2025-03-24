import { Injectable } from '@nestjs/common';
import { Drizzle, InjectDrizzle } from '../drizzle/drizzle.module';
import { userSessions } from './entities/user_sessions';
import { UserSessionDto } from './dto/user_session.dto';
import { and, eq } from 'drizzle-orm';

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

  async findByToken(sessionToken: string): Promise<UserSessionDto | null> {
    const result = await this.db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.session_token, sessionToken),
          eq(userSessions.is_active, true)
        )
      );
    return result[0] || null;
  }

  async findByIp(ipAddress: string): Promise<UserSessionDto | null> {
    const result = await this.db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.ip_address, ipAddress),
          eq(userSessions.is_active, true)
        )
      );
    return result[0] || null;
  }

  async deactivateSession(sessionToken: string): Promise<UserSessionDto | null> {
    const [updatedSession] = await this.db
      .update(userSessions)
      .set({ is_active: false })
      .where(eq(userSessions.session_token, sessionToken))
      .returning();
    return updatedSession || null;
  }
}
