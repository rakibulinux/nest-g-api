import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ExecutionRequest } from './context';

export const CurrentAuth = createParamDecorator((_, ctx: ExecutionContext) => {
  const req: ExecutionRequest = ctx.switchToHttp().getRequest();
  return req.auth;
});
