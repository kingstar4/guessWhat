import NavigateButton from '@/components/ui/NavigateButton';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/designTokens';
import { usePortraitLock } from '@/hooks/usePortrait';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Home = () => {
  usePortraitLock();
  const router = useRouter();

  return (
    <ScreenBackground>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="star-four-points-circle-outline" size={32} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.appTitle}>GuessWhat</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Game Lobby Section */}
        <View style={styles.lobbySection}>
          <Text style={styles.lobbyLabel}>GAME LOBBY</Text>
          <Text style={styles.heading}>Choose Game Mode</Text>
          <Text style={styles.subheading}>Ready to start the fun? Pick your challenge.</Text>
        </View>

        {/* Game Mode Cards */}
        <View style={styles.buttonContainer}>
          <View style={styles.modeCard}>
            <Text style={styles.modeTitle}>Team Play</Text>
            <Text style={styles.modeDescription}>
              Split into groups and compete for the highest score!
            </Text>
            <NavigateButton
              title='Coming Soon'
              to='/teamMode'
              variant='primary'
              disabled={true}
            />
          </View>

          <View style={styles.modeCard}>
            <Text style={styles.modeTitle}>Classic 1v1</Text>
            <Text style={styles.modeDescription}>
              Ahead-to-head battle of wits and speed.
            </Text>
            <NavigateButton
              title='Play Now'
              to='/category'
              variant='success'
            />
          </View>
        </View>

      </ScrollView>
    </ScreenBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayLight,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing['2xl'],
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  lobbySection: {
    marginBottom: spacing.xl,
  },
  lobbyLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
    backgroundColor: colors.primaryLight + '30',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  heading: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.base,
  },
  buttonContainer: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  modeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  modeTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  modeDescription: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    marginBottom: spacing.base,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.base,
  },
  quickStart: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    ...shadows.sm,
  },
  quickStartIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  quickStartText: {
    flex: 1,
  },
  quickStartTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  quickStartSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
});