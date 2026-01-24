import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { borderRadius, colors, spacing, typography } from '@/constants/designTokens';
import { useBack } from '@/hooks/useBack';
import { useGameStore } from '@/store/useGameStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const timeOptions = [
  { value: 30, label: '30s', description: 'FAST & HECTIC' },
  { value: 60, label: '60s', description: 'STANDARD' },
  { value: 90, label: '90s', description: 'RELAXED' },
  { value: 120, label: '120s', description: 'PRO' },
];

const Timer = () => {
  useBack();
  const router = useRouter();
  const { setSelectedTime, selectedCategory } = useGameStore();
  const [localSelected, setLocalSelected] = useState<number | null>(null);

  const handleSelectTime = (value: number) => {
    setLocalSelected(value);
  };

  const handleStart = () => {
    if (localSelected !== null) {
      setSelectedTime(localSelected);
      router.push('/countdown');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="timer" size={48} color={colors.primary} />
        </View>
        <Text style={styles.title}>How long to play?</Text>
        <Text style={styles.subtitle}>
          Choose how many seconds each player gets per turn
        </Text>
      </View>

      <View style={styles.optionsGrid}>
        {timeOptions.map((option) => (
          <Card
            key={option.value}
            onPress={() => handleSelectTime(option.value)}
            selected={localSelected === option.value}
            style={[
              styles.optionCard,
              localSelected === option.value && styles.selectedCard,
            ]}
          >
            <Text style={[
              styles.timeLabel,
              localSelected === option.value && styles.selectedTimeLabel,
            ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.description,
              localSelected === option.value && styles.selectedDescription,
            ]}>
              {option.description}
            </Text>
          </Card>
        ))}
      </View>

      <Button
        onPress={handleStart}
        variant="primary"
        size="large"
        disabled={localSelected === null}
        style={styles.startButton}
      >
        Let's Go! ▶
      </Button>
    </ScrollView>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.base,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.base,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xl,

  },
  optionCard: {
    width: '48%',
    padding: spacing.lg,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: colors.primary,
  },
  timeLabel: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  selectedTimeLabel: {
    color: colors.textInverse,
  },
  description: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    flexDirection: 'row',
  },
  selectedDescription: {
    color: colors.textInverse,
  },
  startButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: spacing.xs,
  },
});