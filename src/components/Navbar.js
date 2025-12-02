'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'; // <-- Добавили useState
import {
  User,
  LogIn,
  MessageSquareShare,
  GalleryVerticalEnd,
  ShoppingBasket,
  Menu,
  X
} from 'lucide-react';
import { ModeToggle } from "@/components/mode-toggle";
import { authStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {cartStore} from "@/stores/сart.store";

function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- Состояние для мобильного меню

  useEffect(() => setMounted(true), []);

  const isAuthenticated = authStore.isAuth;

  // Функция для переключения состояния меню
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Класс для адаптивного скрытия/показа элементов в основном Navbar
  // 'hidden lg:flex' - скрыт на моб., показан на десктопе
  const hiddenOnMobile = 'hidden lg:flex';

  // Обработчик для навигации из мобильного меню
  const handleMobileNav = (path) => {
    router.push(path);
    setIsMenuOpen(false); // Закрыть меню после клика
  };

  const itemCount = cartStore.itemCount;

  return (
    <nav className="bg-white mb-8 dark:bg-black shadow-md z-50 sticky top-0">
      <div className="container relative">
        <div className="flex justify-between py-4 items-center">

          <div className={`flex-shrink-0 gap-2 ${hiddenOnMobile}`}>
            <ModeToggle />
            <Button onClick={() => router.push('/chat')} >
              <MessageSquareShare className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all "/>Chat
            </Button>
            <Button className="bg-primary/30 text-primary hover:bg-primary/40 border border-primary" onClick={() => router.push('/catalog')} >
              <GalleryVerticalEnd  className="h-[1.2rem] w-[1.2rem]  scale-100 rotate-0 transition-all "/>Catalog
            </Button>
          </div>

          {/* 2. Логотип (Центр) */}
          <Link href="/" className="md:absolute left-1/2 md:-translate-x-1/2">
            <div className="flex items-center gap-3">
              <img
                src="/images/icon.png"
                alt="Osmon"
                className="w-8 h-8 rounded-xl"
              />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">Osmon</span>
            </div>
          </Link>

          {/* 3. Элементы справа (Корзина, Профиль/Логин) и Бургер */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative px-3 flex gap-2 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingBasket />
              {itemCount > 0 && (
                <span className="absolute -top-1 right-0 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

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
              <div className="w-[112px] h-9 rounded-md bg-gray-100 dark:bg-gray-800" aria-hidden />
            )}

            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>

        {/* 4. Мобильное Меню (Скрытые элементы) */}
        <div
          className={`lg:hidden absolute top-[64px] left-0 w-full bg-white dark:bg-black shadow-lg transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-screen border-t dark:border-gray-700' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col p-4 space-y-2">

            {/* Каталог */}
            <Button
              className="w-full justify-start gap-2 bg-primary/30 text-primary hover:bg-primary/40 border border-primary"
              onClick={() => handleMobileNav('/catalog')}
            >
              <GalleryVerticalEnd className="h-[1.2rem] w-[1.2rem]" />
              Каталог
            </Button>

            {/* Чат */}
            <Button
              className="w-full justify-start gap-2"
              onClick={() => handleMobileNav('/chat')}
            >
              <MessageSquareShare className="h-[1.2rem] w-[1.2rem]" />
              Чат
            </Button>

            {/* ThemChanger (ModeToggle) */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="text-gray-700 dark:text-gray-200">Сменить тему</span>
              <ModeToggle />
            </div>

          </div>
        </div>


      </div>
    </nav>
  );
}

export default observer(Navbar);