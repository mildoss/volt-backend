import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {User} from "@prisma/client";

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{user: User}>();
    const user = request.user;

    if (!user.role) throw new ForbiddenException('You have no rights')

    if (user.role !== 'ADMIN') throw new ForbiddenException('You have no rights')

    return true;
  }
}