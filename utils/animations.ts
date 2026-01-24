/**
 * Animation Utilities
 * Reusable animation helpers for React Native
 */

import { durations, springConfigs } from '@/constants/designTokens';
import { Animated, Easing } from 'react-native';

/**
 * Fade in animation
 */
export const fadeIn = (
    animatedValue: Animated.Value,
    duration: number = durations.base,
    toValue: number = 1
): Animated.CompositeAnimation => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
    });
};

/**
 * Fade out animation
 */
export const fadeOut = (
    animatedValue: Animated.Value,
    duration: number = durations.base,
    toValue: number = 0
): Animated.CompositeAnimation => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
    });
};

/**
 * Scale in animation
 */
export const scaleIn = (
    animatedValue: Animated.Value,
    duration: number = durations.base,
    fromValue: number = 0,
    toValue: number = 1
): Animated.CompositeAnimation => {
    animatedValue.setValue(fromValue);
    return Animated.spring(animatedValue, {
        toValue,
        ...springConfigs.default,
        useNativeDriver: true,
    });
};

/**
 * Scale out animation
 */
export const scaleOut = (
    animatedValue: Animated.Value,
    duration: number = durations.base,
    toValue: number = 0
): Animated.CompositeAnimation => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
    });
};

/**
 * Slide in from bottom
 */
export const slideInFromBottom = (
    animatedValue: Animated.Value,
    duration: number = durations.base,
    fromValue: number = 100
): Animated.CompositeAnimation => {
    animatedValue.setValue(fromValue);
    return Animated.spring(animatedValue, {
        toValue: 0,
        ...springConfigs.default,
        useNativeDriver: true,
    });
};

/**
 * Slide in from right
 */
export const slideInFromRight = (
    animatedValue: Animated.Value,
    duration: number = durations.base,
    fromValue: number = 100
): Animated.CompositeAnimation => {
    animatedValue.setValue(fromValue);
    return Animated.spring(animatedValue, {
        toValue: 0,
        ...springConfigs.default,
        useNativeDriver: true,
    });
};

/**
 * Spring animation
 */
export const spring = (
    animatedValue: Animated.Value,
    toValue: number,
    config: 'default' | 'gentle' | 'wobbly' | 'stiff' = 'default'
): Animated.CompositeAnimation => {
    return Animated.spring(animatedValue, {
        toValue,
        ...springConfigs[config],
        useNativeDriver: true,
    });
};

/**
 * Sequence - run animations one after another
 */
export const sequence = (
    animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
    return Animated.sequence(animations);
};

/**
 * Parallel - run animations simultaneously
 */
export const parallel = (
    animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
    return Animated.parallel(animations);
};

/**
 * Pulse animation (for time running out, etc.)
 */
export const pulse = (
    animatedValue: Animated.Value,
    minScale: number = 0.95,
    maxScale: number = 1.05,
    duration: number = 500
): Animated.CompositeAnimation => {
    return Animated.loop(
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: maxScale,
                duration: duration / 2,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: minScale,
                duration: duration / 2,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ])
    );
};

/**
 * Stagger - animate multiple items with delay
 */
export const stagger = (
    delay: number,
    animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
    return Animated.stagger(delay, animations);
};
