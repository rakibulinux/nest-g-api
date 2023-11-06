import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ExecutionRequest } from './context';

export const CurrentHost = createParamDecorator((_, ctx: ExecutionContext) => {
  const req: ExecutionRequest = ctx.switchToHttp().getRequest();
  return `${req.protocol}://${req.get('host')}`;
});
