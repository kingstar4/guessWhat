import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface ArrowButtonProps {
  direction: 'up' | 'down';
  color: 'green' | 'red';
  onPress: () => void;
  disabled?: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ 
  direction, 
  color, 
  onPress, 
  disabled = false 
}) => {
  const backgroundColor = color === 'green' ? '#34C759' : '#FF3B30';

  
  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor },
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{
        color: 'rgba(255, 255, 255, 0.3)',
        borderless: false,
      }}
    >
      <Text style={{fontSize:32, zIndex:1}}>{direction === 'up' ? '😊': '😒'}</Text>
    </Pressable>
  );
};

interface GameControlsProps {
  onCorrect: () => void;
  onWrong: () => void;
  disabled?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onCorrect,
  onWrong,
  disabled = false
}) => {
  return (
    <View style={styles.controlsContainer}>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonLabel}>Correct</Text>
        <ArrowButton
          direction="up"
          color="green"
          onPress={onCorrect}
          disabled={disabled}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonLabel}>Wrong</Text>
        <ArrowButton
          direction="down"
          color="red"
          onPress={onWrong}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      },
    }),
  },
  disabledButton: {
    opacity: 0.5,
  },
  arrow: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ArrowButton;