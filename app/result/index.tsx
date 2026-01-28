import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { borderRadius, colors, spacing, typography } from '@/constants/designTokens';
import { useBack } from '@/hooks/useBack';
import { usePortraitLock } from '@/hooks/usePortrait';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../../store/useGameStore';

const GameResults = () => {
  useBack();
  usePortraitLock();
  const router = useRouter();
  const {
    correctAnswers,
    wrongAnswers,
    selectedCategory,
    gameStartTime,
    gameEndTime,
    resetGame
  } = useGameStore();

  const totalQuestions = correctAnswers.length + wrongAnswers.length;
  const accuracy = totalQuestions > 0 ? (correctAnswers.length / totalQuestions * 100).toFixed(1) : 0;
  const gameDuration = gameStartTime && gameEndTime ?
    Math.round((gameEndTime - gameStartTime) / 1000) : 0;

  const handlePlayAgain = () => {
    resetGame();
    router.replace('/category');
  };

  const handleBackToHome = () => {
    resetGame();
    router.replace('/home');
  };

  const renderAnswerList = (answers: typeof correctAnswers, title: string, iconName: string, iconColor: string) => (
    <View style={styles.answerSection}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name={iconName as any} size={24} color={iconColor} />
        <Text style={[styles.sectionTitle, { color: iconColor }]}>
          {title} ({answers.length})
        </Text>
      </View>
      {answers.length === 0 ? (
        <Text style={styles.emptyText}>No {title.toLowerCase()}</Text>
      ) : (
        <View style={styles.answerList}>
          {answers.map((answer, index) => (
            <Card key={index} style={styles.answerCard}>
              <View style={[styles.answerIndicator, { backgroundColor: iconColor }]} />
              <View style={styles.answerContent}>
                <Text style={styles.answerTerm}>{answer.word.term}</Text>
                <Text style={styles.answerTaboo}>
                  Taboo: {answer.word.tabooWords.join(', ')}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScreenBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <StatusBar hidden={true} />

        <View style={styles.header}>
          <MaterialIcons name="emoji-events" size={64} color={colors.primary} />
          <Text style={styles.title}>Game Results</Text>
          <Text style={styles.category}>{selectedCategory?.toUpperCase()}</Text>
        </View>

        {/* Score Summary */}
        <View style={styles.summaryContainer}>
          <Card style={styles.scoreCard}>
            <MaterialIcons name="check-circle" size={32} color={colors.success} />
            <AnimatedNumber value={correctAnswers.length} style={styles.scoreNumber} />
            <Text style={styles.scoreLabel}>Correct</Text>
          </Card>

          <Card style={styles.scoreCard}>
            <MaterialIcons name="cancel" size={32} color={colors.error} />
            <AnimatedNumber value={wrongAnswers.length} style={styles.scoreNumber} />
            <Text style={styles.scoreLabel}>Wrong</Text>
          </Card>
        </View>

        {/* Game Stats */}
        <Card style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Questions:</Text>
            <Text style={styles.statValue}>{totalQuestions}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Game Duration:</Text>
            <Text style={styles.statValue}>{gameDuration}s</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Questions per Minute:</Text>
            <Text style={styles.statValue}>
              {gameDuration > 0 ? ((totalQuestions / gameDuration) * 60).toFixed(1) : '0'}
            </Text>
          </View>
        </Card>

        {/* Answer Details */}
        {renderAnswerList(correctAnswers, 'Correct Answers', 'check-circle', colors.success)}
        {renderAnswerList(wrongAnswers, 'Wrong Answers', 'cancel', colors.error)}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button onPress={handlePlayAgain} variant="primary" size="large">
            Play Again
          </Button>

          <Button onPress={handleBackToHome} variant="primary" size="large">
            Back to Home
          </Button>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
};

export default GameResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
    letterSpacing: 0.5,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  scoreCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.base,
  },
  scoreNumber: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  scoreLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  statsContainer: {
    marginBottom: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  answerSection: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: spacing.lg,
  },
  answerList: {
    gap: spacing.sm,
  },
  answerCard: {
    flexDirection: 'row',
    padding: spacing.base,
  },
  answerIndicator: {
    width: 4,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  answerContent: {
    flex: 1,
  },
  answerTerm: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  answerTaboo: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  buttonContainer: {
    gap: spacing.md,
    marginTop: spacing.base,
    marginBottom: spacing.xl,
  },
});