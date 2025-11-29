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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const RegisterForm = observer(({ className, ...props }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dto = registerSchema.parse({ name, email, password, role });
      await authStore.register(dto);
    } catch (err) {
      console.log('Validation error', err);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6 min-h-screen items-center justify-center bg-white dark:bg-black text-black dark:text-white', className)} {...props}>
      <Card className="w-full max-w-md border bg-white dark:bg-black">
        <CardHeader>
          <CardTitle className="text-blue-600">Ro'yxatdan o'tish</CardTitle>
          <CardDescription>
            Ma'lumotlaringizni kiriting va hisobingizni yarating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Ism</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ismingiz"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gray-400 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white focus:ring-blue-600 focus:border-blue-600"
                />
              </Field>

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
                <FieldLabel>Ro'lni tanlang</FieldLabel>
                <Tabs
                  value={role}
                  onValueChange={(val) => setRole(val)}
                  className="mt-2"
                >
                  <TabsList className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-md">
                    <TabsTrigger value="CLIENT" className={cn(role === 'CLIENT' ? 'bg-blue-600 text-black dark:text-white' : '', 'w-1/2')}>
                      Client
                    </TabsTrigger>
                    <TabsTrigger value="SELLER" className={cn(role === 'SELLER' ? 'bg-blue-600 text-black dark:text-white' : '', 'w-1/2')}>
                      Seller
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-600 text-white mt-4"
                >
                  {authStore.loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
                </Button>
                <FieldDescription className="text-center mt-2">
                  Hisobingiz bormi?{' '}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Kirish
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
