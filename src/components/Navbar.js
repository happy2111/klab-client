'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {
  User,
  LogIn,
  MessageSquareShare
} from 'lucide-react';
import { ModeToggle } from "@/components/mode-toggle";
import { authStore } from "@/stores/auth.store";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

function Navbar() {
  const router = useRouter()

  // Avoid hydration mismatch by deferring auth-dependent UI until after mount
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => setMounted(true), []);

  const isAuthenticated = authStore.isAuth;

  return (
    <nav className="bg-white dark:bg-black shadow-md">
      <div className="container relative">
        <div className="flex justify-between py-4 items-center">
          <div className="flex-shrink-0 gap-2 flex">
            <ModeToggle />
            <Button onClick={() => router.push('/chat')} >
                <MessageSquareShare className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all "/>Chat
            </Button>
          </div>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-3">
              <img
                src="/images/icon.png"
                alt="Osmon"
                className="w-8 h-8 rounded-xl"
              />
              <span className="text-2xl font-bold text-gray-900">Osmon</span>
            </div>
          </Link>
          <div className="flex items-center space-x-4" suppressHydrationWarning>
            {mounted ? (
              isAuthenticated ? (
                <Link
                  href="/profile"
                  className="px-3 flex gap-2 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User/>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 flex gap-2 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogIn/>
                </Link>
              )
            ) : (
              // Placeholder to keep SSR/first client render identical
              <div className="w-[112px] h-9 rounded-md bg-gray-100 dark:bg-gray-800" aria-hidden />
            )}


          </div>
        </div>
      </div>
    </nav>
  );
}

// ✅ Экспортируем обернутый компонент
export default observer(Navbar);