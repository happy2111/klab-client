"use client";

import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { profileStore } from '@/stores/profile.store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Key } from 'lucide-react';

export const PasswordChangeForm = observer(() => {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (passwords.newPassword.length < 6) {
      setError('Новый пароль должен быть не менее 6 символов.');
      return;
    }
    if (passwords.currentPassword === passwords.newPassword) {
      setError('Новый пароль не должен совпадать с текущим.');
      return;
    }

    const success = await profileStore.changePassword(passwords);

    if (success) {
      setPasswords({ currentPassword: '', newPassword: '' });
    } else {
      // Ошибка обрабатывается через toast в store, но можно добавить локальную
      setError('Сбой при смене пароля. Проверьте текущий пароль.');
    }
  };

  return (
    <Card className="max-w-2xl w-full mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl text-black dark:text-white">
          Сменить пароль
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword" className="text-black dark:text-white">
              Текущий пароль
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={handleChange}
                required
                className=" text-black dark:text-white bg-white dark:bg-black/20 border-gray-300 dark:border-white/10 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-black dark:text-white">
              Новый пароль
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handleChange}
                required
                className="text-black dark:text-white bg-white dark:bg-black/20 border-gray-300 dark:border-white/10 focus:border-blue-600"
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={profileStore.passwordLoading || !passwords.currentPassword || !passwords.newPassword}
          >
            {profileStore.passwordLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Обновить пароль'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
});