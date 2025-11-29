"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';
import { profileStore } from '@/stores/profile.store';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Loader2, MessageSquare } from 'lucide-react';

// Обернем страницу в observer для реакции на авторизацию
const ChatPageContent = observer(() => {
  const router = useRouter();

  useEffect(() => {
    // 1. Клиентская защита
    if (!authStore.isAuth) {
      router.replace('/login');
    } else if (!profileStore.profile) {
      // 2. Убедимся, что ID пользователя загружен
      profileStore.fetchProfile();
    }

    // 3. ⚠️ Важно: Убедитесь, что ChatStore чистится при уходе со страницы (TBD)

  }, [router]);

  if (!authStore.isAuth || !profileStore.profile) {
    // Ждем загрузки профиля и аутентификации
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Основной макет чата
  return (
    <div className="flex min-h-[90vh] py-4 px-4 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-6xl mx-auto flex h-[85vh] bg-white dark:bg-zinc-900 shadow-xl rounded-lg overflow-hidden border dark:border-white/10">

        {/* Левая панель: Список чатов (30% ширины) */}
        <div className="w-full sm:w-1/3 min-w-[280px] flex flex-col">
          <h2 className="text-lg font-bold p-4 border-b dark:border-white/10 text-black dark:text-white">
            <MessageSquare className="w-5 h-5 inline-block mr-2 text-blue-600" />
            Мои Чаты
          </h2>
          <ChatList />
        </div>

        {/* Правая панель: Окно чата (70% ширины) */}
        <div className="flex-1 border-l dark:border-white/10">
          <ChatWindow />
        </div>

      </div>
    </div>
  );
});

export default ChatPageContent;