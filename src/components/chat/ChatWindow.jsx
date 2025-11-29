"use client";

import { useEffect, useCallback } from 'react';
import { chatStore } from '@/stores/chat.store';
import { profileStore } from '@/stores/profile.store';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite'; // ← ВЕРНИ ЭТО!


export const ChatWindow = observer(() => {
  const { register, handleSubmit, reset, watch } = useForm();
  const currentUserId = profileStore.profile?.id;
  const messages = chatStore.messages;
  const currentChatId = chatStore.currentChatId;

  const currentChat = chatStore.chats.find(c => c.id === currentChatId);
  const participant = currentChat
    ? (currentChat.clientId === currentUserId ? currentChat.seller : currentChat.client)
    : null;

  const onSubmit = (data) => {
    if (data.message.trim()) {
      chatStore.sendMessage(data.message.trim());
      reset();
    }
  };

  // Автоскролл — без ref!
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
      // Или если ScrollArea — он сам скроллит
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  if (!currentChatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-black/30">
        <div className="text-center">
          <MessageSquare className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-medium">Выберите чат</p>
          <p className="text-sm mt-2">Начните общение с продавцом</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок */}
      <div className="p-6 border-b dark:border-white/10 flex items-center gap-4 bg-white dark:bg-zinc-900">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {participant?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="font-bold text-xl text-black dark:text-white">
            {participant?.name || participant?.email?.split('@')[0] || "Пользователь"}
          </h2>
          <p className="text-sm text-green-600 font-medium">Онлайн</p>
        </div>
      </div>

      {/* Сообщения */}
      <ScrollArea className="flex-1 px-6 bg-gray-50 dark:bg-black/30">
        <div className="py-6 space-y-5 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">Напишите первое сообщение!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`
                      max-w-xs lg:max-w-md px-5 py-3.5 rounded-3xl shadow-lg font-medium
                      ${isMine
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-zinc-800 text-black dark:text-white border dark:border-white/10'
                    }
                      ${msg.isPending ? 'opacity-70 italic' : ''}
                    `}
                  >
                    <p className="break-words leading-relaxed">{msg.content}</p>
                    <div className={`text-xs mt-2 flex items-center gap-1 ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                      <span>{format(new Date(msg.createdAt), 'HH:mm', { locale: ru })}</span>
                      {msg.isPending && <span>отправляется</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div className="h-1" /> {/* Для скролла */}
        </div>
      </ScrollArea>

      {/* Форма — БЕЗ ref, БЕЗ useRef, БЕЗ БАГОВ */}
      <div className="p-4 border-t dark:border-white/10 bg-white dark:bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 max-w-4xl mx-auto">
          <input
            {...register('message')}
            type="text"
            placeholder="Напишите сообщение..."
            className="flex-1 h-12 px-5 rounded-2xl border dark:border-white/20 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
});