"use client";

import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { profileStore } from '@/stores/profile.store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Edit, User, Mail, Phone } from 'lucide-react';

export const ProfileDetails = observer(() => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    // Загрузка данных при монтировании
    if (!profileStore.profile) {
      profileStore.fetchProfile();
    }
  }, []);

  useEffect(() => {
    // Обновление локального состояния при изменении данных в store
    if (profileStore.profile) {
      setFormData({
        name: profileStore.profile.name || '',
        email: profileStore.profile.email || '',
        phone: profileStore.profile.phone || '',
      });
    }
  }, [profileStore.profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const success = await profileStore.updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  if (profileStore.loading && !profileStore.profile) {
    return (
      <Card className="w-full max-w-lg mx-auto bg-white dark:bg-black border-gray-300 dark:border-white/10">
        <CardContent className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!profileStore.profile) {
    return <p className="text-center text-lg text-red-500">Профиль не загружен.</p>;
  }

  return (
    <Card className="w-full max-w-lg mx-auto bg-white dark:bg-black border-gray-300 dark:border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-black dark:text-white">
          Ваш профиль
        </CardTitle>
        <Button
          variant="outline"
          className="hover:bg-blue-50 dark:hover:bg-white/10 border-gray-300 dark:border-white/10 text-black dark:text-white"
          onClick={() => setIsEditing(prev => !prev)}
        >
          {isEditing ? 'Отмена' : <Edit className="h-4 w-4 mr-2 text-blue-600" />}
          {isEditing ? 'Отмена' : 'Редактировать'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {['name', 'email', 'phone'].map(field => (
          <div key={field} className="space-y-1.5">
            <Label htmlFor={field} className="text-black dark:text-white capitalize">
              {field === 'name' ? 'Имя' : field === 'email' ? 'Email' : 'Телефон'}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/9 text-gray-400">
                {/*{field === 'name' && <User className="h-4 w-4" />}*/}
                {/*{field === 'email' && <Mail className="h-4 w-4" />}*/}
                {/*{field === 'phone' && <Phone className="h-4 w-4" />}*/}
              </span>
              <Input
                id={field}
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                value={formData[field]}
                onChange={handleChange}
                disabled={!isEditing || (field === 'email' && profileStore.profile.role === 'ADMIN')}
                className={`pl-10 text-black dark:text-white bg-white dark:bg-black border-gray-300 dark:border-white/10 focus:border-blue-600 ${!isEditing ? 'cursor-default' : ''}`}
              />
            </div>
            {field === 'email' && profileStore.profile.role && (
              <p className="text-xs mt-4 mb-4 text-gray-500 dark:text-gray-400">
                Роль: <span className="font-semibold text-blue-600">{profileStore.profile.role}</span>
              </p>
            )}
          </div>
        ))}
      </CardContent>

      {isEditing && (
        <CardFooter>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave}
            disabled={profileStore.loading}
          >
            {profileStore.loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Сохранить изменения
          </Button>
        </CardFooter>
      )}
    </Card>
  );
});