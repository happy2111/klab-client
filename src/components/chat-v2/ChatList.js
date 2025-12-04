import React from 'react'
import {MessageCircle, Users} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {chatStore} from "@/stores/chat2.store";
import {Card} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {authStore} from "@/stores/auth.store";
import {format} from "date-fns";

const ChatList = () => {
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

  )
}
export default ChatList
