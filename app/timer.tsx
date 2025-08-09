import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import ActionButton from '../components/ui/ActionButton';
import { useGameStore } from '../store/useGameStore';

const TIME_OPTIONS = [
  { seconds: 30, label: '30 Seconds' },
  { seconds: 60, label: '60 Seconds' },
  { seconds: 90, label: '90 Seconds' },
];

const Timer = () => {
  const router = useRouter();
  const { setSelectedTime, selectedTime } = useGameStore();

  const handleTimeSelect = (seconds: number) => {
    setSelectedTime(seconds);
  };

  const handleContinue = () => {
    if (selectedTime) {
      router.push('/gameRoom');
    }
  };

  return (
    <View style={styles.container}>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 40,
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
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
      web: {
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
    }),
  },
});