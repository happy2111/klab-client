// src/components/Navbar.jsx
'use client';

import Link from 'next/link';
// ✅ Импортируем observer
import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  ShoppingCart,
  User,
  LogIn,
  ChefHatIcon,
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
  React.useEffect(() => setMounted(true), []);

  const isAuthenticated = authStore.isAuth;

  return (
    <nav className="bg-white dark:bg-black shadow-md">
      <div className="container">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 gap-2 flex">
            <ModeToggle />
            <Button onClick={() => router.push('/chat')} >
                <MessageSquareShare className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all "/>Chat
            </Button>
          </div>
          <Link href="/" className="sm:absolute left-1/2 -translate-x-1/2">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Osmon
              </span>
          </Link>
          <div className="flex items-center space-x-4" suppressHydrationWarning>
            <Link href="/cart" className="relative text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>
            {mounted ? (
              isAuthenticated ? (
                <Link
                  href="/profile"
                  className="px-3 flex gap-2 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User/> Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 flex gap-2 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogIn/>Kirish
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