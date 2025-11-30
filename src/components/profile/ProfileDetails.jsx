"use client";

import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';
import { profileStore } from '@/stores/profile.store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Edit, Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import ProfileProducts from "@/components/product/ProfileProducts";

export const ProfileDetails = observer(() => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const dispose = autorun(() => {
      if (profileStore.profile) {
        setFormData({
          name: profileStore.profile.name || '',
          email: profileStore.profile.email || '',
          phone: profileStore.profile.phone || '',
        });
      }
    });
    return () => dispose();
  }, []);

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

  if (!profileStore.profile && profileStore.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profileStore.profile) {
    return <p className="text-center text-red-500">Профиль не найден</p>;
  }


  return (
    <>
    <Card className="max-w-2xl w-full mx-auto shadow-xl">
      <CardHeader className="flex flex-row flex-wrap max-sm:flex-col-reverse sm:items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileStore.profile.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <CardTitle className="text-2xl">{profileStore.profile.name || 'Пользователь'}</CardTitle>
            <p className="text-sm text-gray-500">Роль: <span className="font-semibold text-blue-600">{profileStore.profile.role}</span></p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="hover:bg-blue-50 ml-auto"
        >
          {isEditing ? 'Отмена' : <Edit className="h-4 w-4 mr-2" />}
          {isEditing ? 'Отмена' : 'Редактировать'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {(['name', 'email', 'phone']).map(field => (
          <div key={field} className="space-y-2">
        <Label className="text-base">
          {field === 'name' ? 'Имя' : field === 'email' ? 'Email' : 'Телефон'}
        </Label>
        <Input
          name={field}
          value={formData[field]}
          onChange={handleChange}
          disabled={!isEditing}
          type={field === 'email' ? 'email' : 'text'}
          className={`text-lg ${!isEditing && 'bg-gray-50 dark:bg-black/20'}`}
        />
      </div>
      ))}
    </CardContent>

    {isEditing && (
      <CardFooter>
        <Button
          onClick={handleSave}
          disabled={profileStore.updateLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {profileStore.updateLoading ? (
            <>Сохранение...</>
          ) : (
            <>Сохранить изменения</>
          )}
        </Button>
      </CardFooter>
    )}
    </Card>
</>
);
});