"use client";

import { observer } from 'mobx-react-lite';
import { chatStore } from '@/stores/chat.store';
import { profileStore } from '@/stores/profile.store';
import { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const ChatWindow = observer(() => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUserId = profileStore.profile?.id;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatStore.messages]);

  if (!chatStore.currentChatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageSquare className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <p className="text-xl">Выберите чат</p>
          <p className="text-sm mt-2">Начните общение с продавцом</p>
        </div>
      </div>
    );
  }

  const currentChat = chatStore.chats.find(c => c.id === chatStore.currentChatId);
  const participant = currentChat
    ? (currentChat.clientId === currentUserId ? currentChat.seller : currentChat.client)
    : null;

  const handleSend = () => {
    if (inputRef.current?.value.trim()) {
      chatStore.sendMessage(inputRef.current.value.trim());
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок чата */}
      <div className="p-6 border-b dark:border-white/10 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {participant?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="font-bold text-xl text-black dark:text-white">
            {participant?.name || participant?.email || "Пользователь"}
          </h2>
          <p className="text-sm text-green-600">Онлайн</p>
        </div>
      </div>

      {/* Сообщения */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4">
          {chatStore.messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-xs lg:max-w-md px-4 py-3 rounded-2xl
                    ${isMine
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-white/10 text-black dark:text-white'
                  }
                    ${msg.isPending ? 'opacity-70' : ''}
                  `}
                >
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-500'}`}>
                    {format(new Date(msg.createdAt), 'HH:mm', { locale: ru })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Поле ввода */}
      <div className="p-4 border-t dark:border-white/10">
        <div className="flex gap-3">
          <Input
            ref={inputRef}
            placeholder="Напишите сообщение..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
});