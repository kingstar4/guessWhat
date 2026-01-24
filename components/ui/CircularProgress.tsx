/**
 * CircularProgress Component
 * Circular timer with countdown display (inspired by reference design)
 */

import { colors, typography } from '@/constants/designTokens';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
    size?: number;
    timeLeft: number;
    totalTime: number;
    strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 80,
    timeLeft,
    totalTime,
    strokeWidth = 8,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const progress = useSharedValue(1);

    useEffect(() => {
        const progressValue = timeLeft / totalTime;
        progress.value = withTiming(progressValue, {
            duration: 1000,
            easing: Easing.linear,
        });
    }, [timeLeft, totalTime]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    // Change color based on time remaining
    const getColor = () => {
        const percentage = (timeLeft / totalTime) * 100;
        if (percentage <= 20) return colors.error;
        if (percentage <= 50) return colors.primaryDark;
        return colors.primary;
    };

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} style={styles.svg}>
                {/* Background circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors.border}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                {/* Progress circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>

            {/* Time display */}
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{timeLeft}</Text>
                <Text style={styles.labelText}>SEC</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        position: 'absolute',
    },
    timeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.text,
    },
    labelText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
        color: colors.textSecondary,
        letterSpacing: 0.5,
    },
});
