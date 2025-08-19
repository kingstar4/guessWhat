import { Href, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export function useBack ( path:Href ="/home"){
    const router = useRouter();

    useEffect(() => {
    const backAction = () => {
      router.replace(path);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [path, router]);
    

}