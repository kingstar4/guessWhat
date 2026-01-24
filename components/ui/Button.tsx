/**
 * Button Component
 * Modern button with multiple variants and animations
 */

import { borderRadius, colors, shadows, spacing, springConfigs, typography } from '@/constants/designTokens';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'success' | 'error' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
    haptic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    fullWidth = false,
    haptic = true,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96, springConfigs.stiff);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, springConfigs.stiff);
    };

    const handlePress = () => {
        if (haptic) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    };

    const buttonStyles = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        textStyle,
    ];

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[animatedStyle, buttonStyles]}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textInverse}
                />
            ) : (
                <Text style={textStyles}>{children}</Text>
            )}
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
        minHeight: 44,
        ...shadows.sm,
    },
    fullWidth: {
        width: '100%',
    },

    // Variants
    primary: {
        backgroundColor: colors.primary,
    },
    success: {
        backgroundColor: colors.success,
    },
    error: {
        backgroundColor: colors.error,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },

    // Sizes
    small: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    medium: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    large: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.base,
    },

    // Text styles
    text: {
        fontWeight: typography.weights.semibold,
        textAlign: 'center',
    },
    primaryText: {
        color: colors.textInverse,
        fontSize: typography.sizes.base,
    },
    successText: {
        color: colors.textInverse,
        fontSize: typography.sizes.base,
    },
    errorText: {
        color: colors.textInverse,
        fontSize: typography.sizes.base,
    },
    outlineText: {
        color: colors.primary,
        fontSize: typography.sizes.base,
    },
    ghostText: {
        color: colors.primary,
        fontSize: typography.sizes.base,
    },

    smallText: {
        fontSize: typography.sizes.sm,
    },
    mediumText: {
        fontSize: typography.sizes.base,
    },
    largeText: {
        fontSize: typography.sizes.lg,
    },

    disabled: {
        opacity: 0.5,
    },
});
