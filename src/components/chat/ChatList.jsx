// src/components/chat/ChatList.jsx
"use client";

import { observer } from 'mobx-react-lite';
import { chatStore } from '@/stores/chat.store';
import { useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageSquare, CornerUpLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authStore } from '@/stores/auth.store';
import {profileStore} from "@/stores/profile.store"; // Для определения, кто текущий пользователь

export const ChatList = observer(() => {
  useEffect(() => {
    // Загружаем чаты при монтировании
    chatStore.fetchChats();
  }, []);

  if (chatStore.loadingChats) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (chatStore.chats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        У вас пока нет активных чатов.
      </div>
    );
  }

  const currentUserId = profileStore.profile?.id;

  return (
    <ScrollArea className="h-full border-r dark:border-white/10">
      <div className="space-y-1 p-3">
        {chatStore.chats.map((chat) => {
          // Получаем ID текущего пользователя
          const currentUserId = authStore.profile?.id;
          const participantObject = chat.clientId === currentUserId ? chat.seller : chat.client;

          if (!participantObject) {
            console.warn(`Чат ID ${chat.id} не имеет данных участника.`);
            return null; // Пропускаем неполный чат
          }

          const otherParticipantName = participantObject.name || participantObject.email || "Неизвестный пользователь";

          const lastMessage = chat.messages?.[chat.messages.length - 1];

          return (
            <div
              key={chat.id}
              onClick={() => chatStore.activateChat(chat.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-black dark:text-white">
                  {otherParticipantName} {/* Используем защищенное имя */}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {lastMessage ? lastMessage.content : 'Нет сообщений'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
});