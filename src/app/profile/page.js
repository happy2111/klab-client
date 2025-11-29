// src/app/profile/page.jsx (обновленный)
"use client";

import { ProfileDetails } from '@/components/ProfileDetails';
import { PasswordChangeForm } from '@/components/PasswordChangeForm';
import { Button } from "@/components/ui/button";
import { authStore } from "@/stores/auth.store";
import { useEffect } from "react"; // 💡 Нужен useEffect
import { useRouter } from "next/navigation"; // 💡 Нужен useRouter
import { profileStore } from "@/stores/profile.store";
import { observer } from 'mobx-react-lite'; // 💡 Обернуть для реактивности

function ProfilePageContent() { // Используем отдельную функцию, чтобы обернуть ее в observer
  const router = useRouter();

  useEffect(() => {
    if (!authStore.isAuth) {
      router.replace('/login');
    } else {
      profileStore.fetchProfile();
    }
  }, [router]);

  if (!authStore.isAuth) {
    return <div className="flex min-h-screen items-center justify-center">
      {/* Можно добавить спиннер или Loader component */}
      <p className="text-gray-500 dark:text-gray-400">Перенаправление...</p>
    </div>;
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 dark:bg-black py-10 px-4">
      <main className="w-full max-w-4xl flex flex-col container">
        <section>
          <ProfileDetails />
        </section>

        <section>
          <PasswordChangeForm />
        </section>

        <Button
          onClick={() => {
            authStore.logout();
            router.replace('/');
          }}
          className="max-w-lg w-full mx-auto mt-4 bg-red-600 hover:bg-red-700"
        >
          Logout
        </Button>
      </main>
    </div>
  );
}

// ✅ Обернуть компонент в observer, чтобы он реагировал на изменение authStore.isAuth
export default observer(ProfilePageContent);