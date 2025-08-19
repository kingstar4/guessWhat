import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';


export default function Index() {
  const router = useRouter()
  const [opacity] = useState(new Animated.Value(1))
  const [isLoading, setLoading]= useState(false);
  
  
 
  useEffect(() => {
    let isActive = true;

    setLoading(true);
    // Start fade out animation after a short delay
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        // Only navigate if the component is still mounted
        if (isActive) {
          setLoading(false);
          router.replace('/home');
        }
      })
    }, 3000)

     
    return () => {
      isActive = false;
      clearTimeout(timer);
    }
   
  }, [router, opacity])

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image source={require('../assets/images/splash.jpg')} priority={'high'} contentFit='cover' style={{position:'absolute', top:0, bottom:0, left:0, right:0}}/>
      
      {isLoading &&
        (
          <View style={{flex:1, alignItems:'center', justifyContent:'center', gap:10}}>
            <ActivityIndicator size={50} color="#007AFF"/>
            <Text style={[styles.text]}>Loading...</Text>
          </View>
        )
      }
      
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    // Remove hardcoded color, now using theme
  }
})