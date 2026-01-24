/**
 * Chip Component
 * Pill-shaped chip for taboo words and tags
 */

import { borderRadius, colors, spacing, typography } from '@/constants/designTokens';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface ChipProps {
    label: string;
    variant?: 'primary' | 'error' | 'success' | 'neutral';
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Chip: React.FC<ChipProps> = ({
    label,
    variant = 'error',
    size = 'medium',
    style,
    textStyle,
}) => {
    const chipStyles = [
        styles.chip,
        styles[variant],
        styles[size],
        style,
    ];

    const chipTextStyles = [
        styles.text,
        styles[`${size}Text`],
        textStyle,
    ];

    return (
        <View style={chipStyles}>
            <Text style={chipTextStyles}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    chip: {
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },

    // Variants
    primary: {
        backgroundColor: colors.primary,
    },
    error: {
        backgroundColor: colors.error,
    },
    success: {
        backgroundColor: colors.success,
    },
    neutral: {
        backgroundColor: colors.textSecondary,
    },

    // Sizes
    small: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    medium: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
    },
    large: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },

    // Text
    text: {
        color: colors.textInverse,
        fontWeight: typography.weights.semibold,
        textAlign: 'center',
    },
    smallText: {
        fontSize: typography.sizes.xs,
    },
    mediumText: {
        fontSize: typography.sizes.sm,
    },
    largeText: {
        fontSize: typography.sizes.base,
    },
});
