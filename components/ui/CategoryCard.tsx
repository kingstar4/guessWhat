/**
 * CategoryCard Component
 * Icon-based card for category selection with gradient backgrounds
 */

import { borderRadius, colors, shadows, spacing, springConfigs, typography } from '@/constants/designTokens';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryCardProps {
  icon: string;
  iconLibrary: 'MaterialIcons' | 'MaterialCommunityIcons' | 'Ionicons';
  text: string;
  gradient: [string, string];
  wordCount?: number;
  onPress?: () => void;
  selected?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  iconLibrary,
  text,
  gradient,
  wordCount = 0,
  onPress,
  selected = false
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, springConfigs.stiff);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfigs.stiff);
  };

  // Select the appropriate icon component
  const IconComponent =
    iconLibrary === 'MaterialIcons' ? MaterialIcons :
      iconLibrary === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
        Ionicons;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, styles.card, selected && styles.selected]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <IconComponent name={icon as any} size={56} color={colors.textInverse} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.categoryName}>{text}</Text>
          <Text style={styles.wordCount}>{wordCount} CARDS</Text>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 180,
    margin: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  selected: {
    borderWidth: 3,
    borderColor: colors.primary,
    ...shadows.lg,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
    textAlign: 'center',
  },
  wordCount: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textInverse,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
});