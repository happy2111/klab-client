// components/chat/ChatList.tsx
"use client";

import { observer } from 'mobx-react-lite';
import { chatStore } from '@/stores/chat.store';
import { profileStore } from '@/stores/profile.store';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from 'lucide-react';

export const ChatList = observer(() => {
  const currentUserId = profileStore.profile?.id;

  if (chatStore.loadingChats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (chatStore.chats.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 mb-6" />
        <p className="text-lg font-medium">Пока нет чатов</p>
        <p className="text-sm mt-2">Начните общение с продавцами!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-3 space-y-2">
        {chatStore.chats.map((chat) => {
          const isClient = chat.clientId === currentUserId;
          const participant = isClient ? chat.seller : chat.client;
          const lastMessage = chat.messages?.[0]; // уже отсортировано по updatedAt

          const name = participant.name || participant.email.split('@')[0] || "Пользователь";
          const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

          return (
            <div
              key={chat.id}
              onClick={() => chatStore.activateChat(chat.id)}
              className={`
                flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
                hover:bg-zinc-100 dark:hover:bg-white/5
                ${chatStore.currentChatId === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
              `}
            >
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-black dark:text-white truncate">
                    {name}
                  </p>
                  {lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(lastMessage.createdAt), {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
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