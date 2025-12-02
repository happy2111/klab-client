"use client";

import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Send, Loader2, MessageCircle, Users } from "lucide-react";

import { chatStore } from "@/stores/chat2.store";
import { authStore } from "@/stores/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ChatPage = observer(() => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (authStore.isAuth && chatStore.chats.length === 0) {
      chatStore.loadMyChats();
    }
  }, [authStore.isAuth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatStore.messages]);

  const handleSend = () => {
    if (!message.trim() || !chatStore.currentChat) return;
    chatStore.sendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = () => {
    chatStore.startTyping();
  };

  // Список чатов
  if (!chatStore.currentChat) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageCircle className="w-8 h-8" />
              Мои чаты
            </h1>
          </div>
        </div>

        <ScrollArea className="flex-1 container">
          <div className="p-4 space-y-3">
            {chatStore.loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </Card>
              ))
            ) : chatStore.chats.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">У вас пока нет чатов</p>
                <p className="text-sm">Начните общение с продавцом!</p>
              </div>
            ) : (
              chatStore.chats.map((chat, i) => {
                const interlocutor = chatStore.interlocutorFromChat(chat);
                const lastMessage = chat.messages?.[0];

                return (
                  <Card
                    key={`${chat.id}-${i}`}
                    className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => chatStore.openChat(chat.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {interlocutor?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {interlocutor?.name || "Без имени"}
                        </p>
                        {lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage.senderId === authStore.user?.id
                              ? "Вы: "
                              : ""}
                            {lastMessage.content}
                          </p>
                        )}
                      </div>
                      {lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(lastMessage.createdAt), "HH:mm")}
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  const interlocutor = chatStore.interlocutor;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-17 z-10">
        <div className="container mx-auto flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{interlocutor?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{interlocutor?.name || "Пользователь"}</p>
              <div className="flex items-center gap-2 text-sm">
                {chatStore.isInterlocutorOnline ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 dark:text-green-400">Онлайн</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Оффлайн</span>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => chatStore.leaveCurrentChat()}>
            ← Назад
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="container space-y-4 max-w-4xl mx-auto">
          {chatStore.loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <Skeleton className="h-20 w-64 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            chatStore.messages.map((msg) => {
              const isMine = msg.senderId === authStore.user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isMine
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {!isMine && (
                      <p className="text-xs font-medium opacity-70 mb-1">
                        {msg.sender.name || "Пользователь"}
                      </p>
                    )}
                    <p className="break-words">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(new Date(msg.createdAt), "HH:mm", { locale: ru })}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing indicator */}
          {chatStore.typingText && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-3 rounded-2xl text-sm">
                <span className="text-muted-foreground">
                  {chatStore.typingText}
                </span>
                <span className="inline-block ml-1 animate-pulse">...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card p-4 sticky bottom-0">
        <div className="container mx-auto max-w-4xl flex gap-2">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Напишите сообщение..."
            className="flex-1"
            disabled={chatStore.loading}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || chatStore.loading}
            size="icon"
            className="rounded-full"
          >
            {chatStore.loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

ChatPage.displayName = "ChatPage";

export default ChatPage;