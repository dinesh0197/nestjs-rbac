import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { rolesList } from '../utils/roles';
import { Roles_key } from '../../common/decorators/roles.decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<rolesList[]>(
      Roles_key,
      [context.getHandler(), context.getClass()],
    );

    // console.log({ requiredRoles });

    if (!requiredRoles) {
      return true;
    }

    console.log({ requiredRoles });

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role: string) => user.role?.includes(role));
  }
}
