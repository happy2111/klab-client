// src/components/chat/ChatWindow.jsx
"use client";

import { observer } from 'mobx-react-lite';
import { chatStore } from '@/stores/chat.store';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { authStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import {profileStore} from "@/stores/profile.store";

// Компонент для отображения одного сообщения
const MessageBubble = ({ message, isSender }) => {
  return (
    <div className={cn(
      "flex mb-3",
      isSender ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-xs sm:max-w-md p-3 rounded-xl shadow-md",
        isSender
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-tl-none"
      )}>
        <p className="text-xs font-semibold mb-1 opacity-70">
          {isSender ? 'Вы' : message.sender.name || message.sender.email}
        </p>
        <p className="break-words">{message.content}</p>
        <span className="text-xs opacity-50 block mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export const ChatWindow = observer(() => {
  const [inputContent, setInputContent] = useState('');
  const messagesEndRef = useRef(null);
  const currentUserId = profileStore.profile?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatStore.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputContent.trim() && chatStore.currentChatId) {
      chatStore.sendMessage(inputContent.trim());
      setInputContent('');
    }
  };

  if (!chatStore.currentChatId) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-white dark:bg-black">
        <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Выберите чат для начала общения
        </p>
      </div>
    );
  }

  if (chatStore.loadingMessages) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full ">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 overflow-y-scroll">
        <div className="flex flex-col justify-end min-h-full">
          {chatStore.messages.map((msg, index) => (
            <MessageBubble
              key={index}
              message={msg}
              isSender={msg.senderId === currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t dark:border-white/10 p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            disabled={!chatStore.currentChatId}
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!inputContent.trim() || !chatStore.currentChatId}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
});