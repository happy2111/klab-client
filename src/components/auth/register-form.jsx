'use client';

import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';
import { registerSchema } from '@/services/schemas/auth.schema';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

export const RegisterForm = observer(({ className, ...props }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dto = registerSchema.parse({ name, email, password, role: (role || 'CLIENT').toUpperCase() });

      const success = await authStore.register(dto);

      if (success) {
        toast.success("Tabriklaymiz! Hisobingiz muvaffaqiyatli yaratildi");
        router.push('/profile');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const messages = err.errors.map(e => e.message).join(', ');
        toast.error("Ma'lumotlar noto'g'ri: " + messages);
      } else if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Ro'yxatdan o'tishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center bg-white dark:bg-black px-4",
      className
    )} {...props}>
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ro&apos;yxatdan o&apos;tish
          </CardTitle>
          <CardDescription className="text-center text-base">
            Hisob yarating va imkoniyatlardan foydalaning
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Ismingiz</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ali Valiev"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ali@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label>Ro&apos;lni tanlang</Label>
              <Tabs value={role} onValueChange={(v) => setRole(v)}>
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger
                    value="CLIENT"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-base font-medium"
                  >
                    Client
                  </TabsTrigger>
                  <TabsTrigger
                    value="SELLER"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-base font-medium"
                  >
                    Seller
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Button
              type="submit"
              disabled={authStore.authLoading}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              {authStore.authLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Yuklanmoqda...
                </span>
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Allaqachon hisobingiz bormi?{' '}
              <a href="/login" className="font-semibold text-blue-600 hover:underline">
                Kirish
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});