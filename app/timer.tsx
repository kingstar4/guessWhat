import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import ActionButton from '../components/ui/ActionButton';
import { useGameStore } from '../store/useGameStore';

const TIME_OPTIONS = [
  { seconds: 30, label: '30 Seconds' },
  { seconds: 60, label: '60 Seconds' },
  { seconds: 90, label: '90 Seconds' },
];

const Timer = () => {
  const [loading, setLoading]= useState(false);
  const router = useRouter();
  const { setSelectedTime, selectedTime } = useGameStore();

  const handleTimeSelect = (seconds: number) => {
    setSelectedTime(seconds);
  };

  const handleContinue = () => {
    setLoading(true);
    if (selectedTime) {
      setLoading(false);
      router.push('/countdown');
    }
  };

  
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/gamepic3.jpg')} priority={'high'} contentFit='cover' style={{position:'absolute', top:0, bottom:0, left:0, right:0}}/>
      <View style={styles.overlay}/>
      <Text style={styles.title}>Select Time Frame</Text>
      <View style={styles.optionsContainer}>
        {TIME_OPTIONS.map((option) => (
          <Pressable
            key={option.seconds}
            style={[
              styles.timeButton,
              selectedTime === option.seconds && styles.selectedButton,
            ]}
            onPress={() => handleTimeSelect(option.seconds)}
          >
            <Text style={[
              styles.timeButtonText,
              selectedTime === option.seconds && styles.selectedButtonText,
            ]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.bottomContainer}>
        <ActionButton buttonStyle={{
            ...styles.continueButton,
            opacity: !selectedTime ? 0.5 : 1,
          }}
          title="Continue"
          onPress={handleContinue}
        />
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size={40} color="#0000ff" />
          
        </View>
      )}
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // darkens the background
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color:'#ffffff',
  },
  optionsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 40,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(255,255,255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      default: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  timeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    width: 150,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      },
    }),
  },
});