import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ACCOUNT_ID_HEADER } from '../common.constants';

@Injectable()
export class AccountGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const accountId = request.headers?.[ACCOUNT_ID_HEADER];

    const parsed = Number(accountId);

    if (Array.isArray(accountId) || !Number.isInteger(parsed) || parsed <= 0) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
