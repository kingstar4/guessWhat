/**
 * NavigateButton Component
 * Updated to use new Button component
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { ViewStyle } from 'react-native';
import { Button } from './Button';

interface NavigateButtonProps {
  title: string;
  to: string;
  buttonStyle?: ViewStyle;
  variant?: 'primary' | 'success' | 'error' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const NavigateButton: React.FC<NavigateButtonProps> = ({
  title,
  to,
  buttonStyle,
  variant = 'primary',
  size = 'large',
  disabled = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(to as any);
  };

  return (
    <Button
      onPress={handlePress}
      variant={variant}
      size={size}
      style={buttonStyle}
      fullWidth
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default NavigateButton;
