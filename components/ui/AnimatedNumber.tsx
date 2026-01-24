/**
 * AnimatedNumber Component
 * Smoothly animates number changes for scores
 */

import { colors, typography } from '@/constants/designTokens';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface AnimatedNumberProps {
    value: number;
    style?: TextStyle;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    value,
    style,
}) => {
    const [displayValue, setDisplayValue] = useState(value);
    const scale = useSharedValue(1);

    useEffect(() => {
        setDisplayValue(value);
        // Bounce animation when value changes
        scale.value = withSpring(1.2, { damping: 10, stiffness: 100 });
        setTimeout(() => {
            scale.value = withSpring(1, { damping: 10, stiffness: 100 });
        }, 150);
    }, [value]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            <Text style={[styles.text, style]}>{displayValue}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.text,
    },
});
