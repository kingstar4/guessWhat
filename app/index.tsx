import { borderRadius, colors, spacing, typography } from '@/constants/designTokens';
import { useSoundStore } from '@/store/useSoundStore';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [progress] = useState(new Animated.Value(0));
  const [fadeIn] = useState(new Animated.Value(0));
  const playMusic = useSoundStore((s) => s.playMusic);

  useEffect(() => {
    let isActive = true;

    // Fade in animation
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progress, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      if (isActive) {
        // Small delay before navigation
        setTimeout(() => {
          router.replace('/home');
          playMusic();
        }, 200);
      }
    });

    return () => {
      isActive = false;
    };
  }, [router, progress, fadeIn, playMusic]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#F8F9FA', '#E9ECEF']}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View style={[styles.content, { opacity: fadeIn }]}>
        {/* App Icon with Glow */}
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <View style={styles.iconWrapper}>
            <Image
              source={require('../assets/images/guessWhat icon.png')}
              style={styles.icon}
              contentFit="contain"
            />
          </View>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>GuessWhat</Text>
        <View style={styles.underline} />

        {/* Loading Section */}
        <View style={styles.loadingSection}>
          <View style={styles.loadingHeader}>
            <Text style={styles.loadingText}>INITIALIZING</Text>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                { width: progressWidth },
              ]}
            />
          </View>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>"Fun in every round"</Text>

        {/* Footer */}
        <Text style={styles.footer}>GUESS WHAT GAME</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  iconGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryLight,
    opacity: 0.3,
    top: -20,
    left: -20,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.base,
  },
  appName: {
    fontSize: 48,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: -1,
  },
  underline: {
    width: 80,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    marginTop: -spacing.lg,
  },
  loadingSection: {
    width: 300,
    marginTop: spacing['2xl'],
  },
  loadingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  loadingText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    letterSpacing: 1.5,
  },
  versionText: {
    fontSize: typography.sizes.xs,
    color: colors.textTertiary,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  tagline: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.xl,
  },
  footer: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textTertiary,
    letterSpacing: 2,
    marginTop: spacing['2xl'],
  },
});