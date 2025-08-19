import NavigateButton from '@/components/ui/NavigateButton';
import { usePortraitLock } from '@/hooks/usePortrait';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Home = () => {
  usePortraitLock();
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/gamepic2.jpg')} priority={'high'} contentFit='cover' style={{position:'absolute', top:0, bottom:0, left:0, right:0}}/>
      <View style={styles.overlay}/>
      {/* <Text style={styles.title}>Choose Game Mode</Text> */}
      <View style={styles.buttonContainer}>
        <NavigateButton 
          title='Team Mode' 
          to='/teamMode'
          buttonStyle={styles.button}
        />
        <NavigateButton 
          title='One-on-One (Single Mode)' 
          to='/category'
          buttonStyle={{...styles.button, backgroundColor:'#fe5f28'}}
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
  overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // darkens the background
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color:'#ffffff',
    zIndex:5,
    elevation: 5,
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