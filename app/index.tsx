import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'

export default function Index() {
  const router = useRouter()
  const [opacity] = useState(new Animated.Value(1))

  useEffect(() => {
    let isActive = true;

    // Start fade out animation after a short delay
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Only navigate if the component is still mounted
        if (isActive) {
          router.replace('/home')
        }
      })
    }, 500)

    return () => {
      isActive = false;
      clearTimeout(timer);
    }
  }, [router, opacity])

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>Loading...</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  }
})
