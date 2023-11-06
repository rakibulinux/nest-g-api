import { Controller, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function upperFirstChar(value: string) {
  return [value.at(0).toUpperCase(), value.substring(1)].join('');
}

export function kebabToCamel(value: string) {
  return value
    .split('-')
    .map((item) => upperFirstChar(item))
    .join('');
}

export const SecureController = (controllerName: string, apiTag?: string) => {
  return applyDecorators(
    Controller(controllerName),
    ApiBearerAuth(),
    ApiTags(apiTag ?? kebabToCamel(controllerName)),
  );
};
