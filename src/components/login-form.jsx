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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {useRouter} from "next/navigation";

export const LoginForm = observer(({ className, ...props }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dto = loginSchema.parse({ email, password });
      await authStore.login(dto);
      if (authStore.isAuth) {
        router.push('/profile');
      }
    } catch (err) {
      console.log('Validation error', err);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6 min-h-screen items-center justify-center bg-white dark:bg-black text-black dark:text-white', className)} {...props}>


      <Card className="w-full max-w-md border bg-white dark:bg-black">
        <CardHeader>
          <CardTitle className="text-blue-600">Kirish</CardTitle>
          <CardDescription>
            Emailingizni kiriting va tizimga kiring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-400 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white focus:ring-blue-600 focus:border-blue-600"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Parol</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-400 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white focus:ring-blue-600 focus:border-blue-600"
                />
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-600 text-white"
                >
                  {authStore.loading ? "Yuklanmoqda..." : "Kirish"}
                </Button>
                <FieldDescription className="text-center mt-2">
                  Hisobingiz yo'q?{' '}
                  <a href="/register" className="text-blue-600 hover:underline">
                    Ro'yxatdan o'tish
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
});
