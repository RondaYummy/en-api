import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserSessionsRepository } from '../modules/auth/user_sessions.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionsRepo: UserSessionsRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const sessionToken = request.cookies?.session_token;
    if (!sessionToken) {
      throw new UnauthorizedException('Session token not found');
    }

    const session = await this.sessionsRepo.findByToken(sessionToken);
    if (!session || !session.is_active || (session.expires_at && session.expires_at < new Date())) {
      await this.sessionsRepo.deactivateSession(sessionToken);
      throw new UnauthorizedException('Invalid or inactive session');
    }

    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions: string[] = session.permissions || [];
      const hasPermission = requiredPermissions.every(permission =>
        userPermissions.includes(permission),
      );
      if (!hasPermission) {
        throw new UnauthorizedException('Insufficient permissions');
      }
    }

    return true;
  }
}
