import { z } from 'zod';

export const alertsQuerySchema = z.object({
  asset: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  since: z.coerce.number().int().nonnegative().optional(),
});

export type AlertsQuery = z.infer<typeof alertsQuerySchema>;

export const subscriptionCreateSchema = z
  .object({
    webhookUrl: z.string().url().optional(),
    telegramChatId: z.string().min(1).optional(),
    assetFilter: z.array(z.string().min(1)).optional(),
    secret: z.string().min(8).optional(),
  })
  .refine((data) => (data.webhookUrl !== undefined) !== (data.telegramChatId !== undefined), {
    message: 'Provide exactly one of webhookUrl or telegramChatId',
  });

export type SubscriptionCreate = z.infer<typeof subscriptionCreateSchema>;
