import { AuthAction } from './auth.enum';

export const AuthMessages = {
  [AuthAction.DEFINE_PASSWORD]: 'Account created successfully',
  [AuthAction.RESET_PASSWORD]: 'Reset your password',
};

export const AuthViews = {
  definePassword: 'define-password',
  setPassword: 'set-password',
  resetPassword: 'reset-password',
};
