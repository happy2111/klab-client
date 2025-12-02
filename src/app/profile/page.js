"use client";

import { useEffect } from "react";
import { observer } from 'mobx-react-lite';
import { useRouter } from "next/navigation";
import { authStore } from "@/stores/auth.store";
import { profileStore } from "@/stores/profile.store";
import { ProfileDetails } from '@/components/profile/ProfileDetails';
import { PasswordChangeForm } from '@/components/profile/PasswordChangeForm';
import { Button } from "@/components/ui/button";
import ProfileProducts from "@/components/product/ProfileProducts";
import { Loader2 } from "lucide-react";

const ProfilePageContent = observer(() => {
  const router = useRouter();

  useEffect(() => {
    if (authStore.appLoading) return;

    if (!authStore.isAuth) {
      router.replace('/login');
      return;
    }


    if (!profileStore.profile && !profileStore.profileLoading) {
      profileStore.fetchProfile();
    }

  }, [authStore.appLoading, authStore.isAuth, profileStore.profile, router]);

  if (authStore.appLoading || (!profileStore.profile && profileStore.profileLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profileStore.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-6">
        <p className="text-red-500 text-xl">Профиль не загружен</p>
        <Button onClick={() => profileStore.fetchProfile()} variant="outline">
          Повторить попытку
        </Button>
      </div>
    );
  }

  const userProducts = profileStore.profile.products ?? [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-10 px-4">
      <main className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProfileDetails />
          <div className="flex flex-col gap-6">
            <PasswordChangeForm />
            <Button
              onClick={() => authStore.logout()}
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Чиқиш (Logout)
            </Button>
          </div>
        </div>

        <ProfileProducts products={userProducts} />
      </main>
    </div>
  );
});

export default ProfilePageContent;