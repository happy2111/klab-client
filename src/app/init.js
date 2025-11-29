'use client';

import { useEffect } from 'react';
import { authStore } from '@/stores/auth.store';
import { profileStore } from '@/stores/profile.store';

export function AppInitializer() {
  useEffect(() => {
    const init = async () => {
      await authStore.init();
      if (authStore.isAuth) {
        await profileStore.fetchProfile();
      }
    };
    init();
  }, []);

  return null;
}