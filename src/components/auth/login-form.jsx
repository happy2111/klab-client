'use client';

import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';
import { loginSchema } from '@/services/schemas/auth.schema';
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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

export const LoginForm = observer(({ className, ...props }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dto = loginSchema.parse({ email, password });

      const success = await authStore.login(dto);
      if (success) {
        toast.success("Xush kelibsiz!");
        router.push('/profile');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const message = err.errors.map(e => e.message).join(', ');
        toast.error("Ma'lumotlar noto'g'ri: " + message);
      } else {
        toast.error("Kirishda xatolik yuz berdi");
      }
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br bg-white dark:bg-black", className)} {...props}>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tizimga kirish
          </CardTitle>
          <CardDescription className="text-center">
            Email va parolingizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={authStore.authLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-6 text-lg"
            >
              {authStore.authLoading ? (
                <>Yuklanmoqda...</>
              ) : (
                "Kirish"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Hisobingiz yo&#39;qmi?{' '}
              <a href="/register" className="text-blue-600 hover:underline font-medium">
                Ro&apos;yxatdan o&apos;tish
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});