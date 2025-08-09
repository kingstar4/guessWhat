import { usePathname } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';

export const usePortraitLock = () => {
  const pathname = usePathname();

  useEffect(() => {
    // If we're on the GameRoom screen, do not lock to portrait
    if (pathname.includes('/gameRoom')) return;

    const lock = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    lock();
  }, [pathname]);
};
