"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';
import { profileStore } from '@/stores/profile.store';
import { chatStore } from '@/stores/chat.store';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Loader2, MessageSquare, ArrowLeft } from 'lucide-react';
import { socketService } from '@/services/socket.service';

function ChatPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Wait until auth initialization completes
    if (authStore.appLoading) return;

    if (!authStore.isAuth) {
      router.replace('/login');
      return;
    }

    if (!profileStore.profile && !profileStore.profileLoading) {
      // profileStore.fetchProfile();
    }
    chatStore.fetchChats();
    socketService.connect();
  }, [router, authStore.appLoading, authStore.isAuth, profileStore.profile, profileStore.profileLoading]);

  // Loading states: wait for auth init and profile
  if (authStore.appLoading || !authStore.isAuth || (!profileStore.profile && profileStore.profileLoading)) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-4 px-4 ">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // МОБИЛЬНАЯ ВЕРСИЯ — только список или только чат
  if (isMobile) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
        {/* Заголовок */}
        <div className="bg-white dark:bg-zinc-900 border-b dark:border-white/10 px-4 py-4 flex items-center gap-3">
          {showChat && (
            <button
              onClick={() => setShowChat(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <MessageSquare className="w-7 h-7 text-blue-600" />
          <h1 className="text-xl font-bold">Чаты</h1>
        </div>

        {/* Список чатов или окно чата */}
        <div className="flex-1 overflow-hidden">
          {!showChat ? (
            <div className="h-full">
              <ChatList onChatSelect={() => setShowChat(true)} />
            </div>
          ) : (
            <div className="h-full bg-white dark:bg-zinc-900">
              <ChatWindow />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ДЕСКТОПНАЯ ВЕРСИЯ — два столбца
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-4 px-4">
      <div className="container h-[90vh]">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border dark:border-white/10 h-full flex">
          {/* Левая панель — список чатов */}
          <div className="w-96 border-r dark:border-white/10 flex flex-col">
            <div className="p-6 border-b dark:border-white/10">
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                Мои чаты
              </h1>
            </div>
            <ChatList />
          </div>

          {/* Правая панель — окно чата */}
          <div className="flex-1 flex flex-col">
            {chatStore.currentChatId ? (
              <ChatWindow />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <p className="text-xl font-medium">Выберите чат</p>
                  <p className="text-sm mt-2">Начните общение с продавцом</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(ChatPage);