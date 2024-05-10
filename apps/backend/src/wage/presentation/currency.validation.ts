import { z } from 'zod';

export const currencySchema = z.string().min(3);
