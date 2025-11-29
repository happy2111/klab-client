// app/chat/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';
import { profileStore } from '@/stores/profile.store';
import { chatStore } from '@/stores/chat.store';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Loader2, MessageSquare } from 'lucide-react';

const ChatPage = observer(() => {
  const router = useRouter();

  useEffect(() => {
    if (!authStore.isAuth) {
      router.replace('/login');
      return;
    }

    // Гарантированная загрузка профиля и чатов
    if (!profileStore.profile) {
      profileStore.fetchProfile();
    }
    chatStore.fetchChats();
  }, [router]);

  if (!authStore.isAuth || !profileStore.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border dark:border-white/10 h-[85vh]">
          <div className="flex h-full">
            {/* Левая панель — список чатов */}
            <div className="w-full sm:w-96 border-r dark:border-white/10 flex flex-col">
              <div className="p-6 border-b dark:border-white/10">
                <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                  Мои чаты
                </h1>
              </div>
              <ChatList />
            </div>

            {/* Правая панель — окно чата */}
            <div className="flex-1 flex flex-col">
              <ChatWindow />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatPage;