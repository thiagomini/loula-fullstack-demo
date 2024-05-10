import { z } from 'zod';

export const requestWageAccessSchema = z.object({
  amount: z.number().gt(0),
  currency: z.string().min(3),
});

export type RequestWageAccessDTO = z.infer<typeof requestWageAccessSchema>;
