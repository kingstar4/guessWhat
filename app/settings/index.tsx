import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/designTokens';
import { useSoundStore } from '@/store/useSoundStore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const Settings = () => {
  const router = useRouter();
  const isSoundOn = useSoundStore((s) => s.isSoundOn);
  const toggleSound = useSoundStore((s) => s.toggleSound);
  const stopMusic = useSoundStore((s) => s.stopMusic);
  const playMusic = useSoundStore((s) => s.playMusic);

  const handleToggle = () => {
    toggleSound();
    if (isSoundOn) {
      stopMusic();
    } else {
      playMusic();
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        {/* Settings Content */}
        <View style={styles.content}>
          {/* Sound Setting */}
          <View style={[styles.settingCard, styles.firstCard]}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isSoundOn ? "volume-high" : "volume-mute"}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Sound & Music</Text>
                <Text style={styles.settingDescription}>
                  {isSoundOn ? 'Sound effects and music enabled' : 'Sound effects and music disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isSoundOn}
              onValueChange={handleToggle}
              trackColor={{ false: colors.borderDark, true: colors.primaryLight }}
              thumbColor={isSoundOn ? colors.primary : colors.surface}
            />
          </View>

          {/* How to Play Setting */}
          <Pressable
            style={styles.settingCard}
            onPress={() => router.push('/settings/howToPlay')}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="help-circle" size={24} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>How to Play</Text>
                <Text style={styles.settingDescription}>Learn the game rules and tips</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </Pressable>

          {/* About Section */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>About</Text>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutText}>GuessWhat! v1.0.0</Text>
              <Text style={styles.aboutSubtext}>
                A fun word-guessing game for friends and family
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.base,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  firstCard: {
    marginTop: spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  aboutSection: {
    marginTop: spacing.xl,
  },
  aboutTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  aboutCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.base,
    padding: spacing.base,
    ...shadows.sm,
  },
  aboutText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  aboutSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.sm,
  },
});