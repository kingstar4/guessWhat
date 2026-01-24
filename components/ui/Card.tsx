/**
 * Card Component
 * Clean white card with rounded corners and subtle shadow
 */

import { borderRadius, colors, shadows, springConfigs } from '@/constants/designTokens';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    selected?: boolean;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    onPress,
    selected = false,
    style,
    disabled = false,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98, springConfigs.stiff);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, springConfigs.stiff);
    };

    const cardStyles = [
        styles.card,
        selected && styles.selected,
        disabled && styles.disabled,
        style,
    ];

    if (onPress && !disabled) {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[animatedStyle, cardStyles]}
            >
                {children}
            </AnimatedPressable>
        );
    }

    return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.base,
        padding: 16,
        ...shadows.base,
    },
    selected: {
        borderWidth: 2,
        borderColor: colors.primary,
        ...shadows.md,
    },
    disabled: {
        opacity: 0.5,
    },
});
