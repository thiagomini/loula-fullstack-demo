import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = Symbol.for('public');
export const Public = () => SetMetadata(PUBLIC_KEY, true);
