import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  senderId: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
  sender: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  }),
});

export const chatSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  sellerId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  client: z.object({ id: z.string(), name: z.string().nullable() }),
  seller: z.object({ id: z.string(), name: z.string().nullable() }),
  messages: z.array(messageSchema).optional(),
});

export const sendMessageSchema = z.object({
  chatId: z.string(),
  content: z.string().min(1, "Сообщение не может быть пустым"),
});

export type Message = z.infer<typeof messageSchema>;
export type Chat = z.infer<typeof chatSchema>;
export type SendMessageDto = z.infer<typeof sendMessageSchema>;