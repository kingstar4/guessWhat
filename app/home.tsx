import NavigateButton from '@/components/ui/NavigateButton'
import { usePortraitLock } from '@/hooks/usePortrait'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Home = () => {
  usePortraitLock();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Game Mode</Text>
      <View style={styles.buttonContainer}>
        <NavigateButton 
          title='Team Mode' 
          to='/teamMode'
          buttonStyle={styles.button}
        />
        <NavigateButton 
          title='One-on-One (Single Mode)' 
          to='/category'
          buttonStyle={styles.button}
        />
      </View>
    </View>
  )
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 20,
  },
  button: {
    width: '100%',
  }
})