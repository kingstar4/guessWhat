import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { borderRadius, colors, spacing, typography } from '@/constants/designTokens';
import { useBack } from '@/hooks/useBack';
import { usePortraitLock } from '@/hooks/usePortrait';
import { MaterialIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { useGameStore } from '../../store/useGameStore';

const GameResults = () => {
  useBack();
  usePortraitLock();
  const router = useRouter();
  const viewShotRef = useRef<ViewShot>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    correctAnswers,
    wrongAnswers,
    selectedCategory,
    gameStartTime,
    gameEndTime,
    resetGame
  } = useGameStore();

  const totalQuestions = correctAnswers.length + wrongAnswers.length;
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

  const handleSaveResult = async () => {
    if (!viewShotRef.current) return;

    setIsSaving(true);
    try {
      // Capture the view as an image
      const uri = await viewShotRef.current.capture?.();

      if (!uri) {
        Alert.alert('Error', 'Failed to capture results');
        return;
      }

      // Request permission to save to media library
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save images to your gallery.');
        return;
      }

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Success! 🎉', 'Your results have been saved to your gallery!');
    } catch (error) {
      console.error('Error saving result:', error);
      Alert.alert('Error', 'Failed to save your results. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareResult = async () => {
    if (!viewShotRef.current) return;

    setIsSaving(true);
    try {
      // Capture the view as an image
      const uri = await viewShotRef.current.capture?.();

      if (!uri) {
        Alert.alert('Error', 'Failed to capture results');
        return;
      }

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        return;
      }

      // Share the image
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your GuessWhat results!',
      });
    } catch (error) {
      console.error('Error sharing result:', error);
      Alert.alert('Error', 'Failed to share your results. Please try again.');
    } finally {
      setIsSaving(false);
    }
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

        {/* Share/Save Buttons */}
        <View style={styles.shareButtonsContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareResult}
            disabled={isSaving}
          >
            <MaterialIcons name="share" size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleSaveResult}
            disabled={isSaving}
          >
            <MaterialIcons name="download" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Capturable Results View */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 1 }}
          style={styles.captureContainer}
        >
          <View style={styles.captureContent}>
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
              <View style={[styles.statItem, styles.statItemLast]}>
                <Text style={styles.statLabel}>Questions per Minute:</Text>
                <Text style={styles.statValue}>
                  {gameDuration > 0 ? ((totalQuestions / gameDuration) * 60).toFixed(1) : '0'}
                </Text>
              </View>
            </Card>

            {/* Branding */}
            <View style={styles.brandingContainer}>
              <Text style={styles.brandingText}>🎮 GuessWhat!</Text>
            </View>
          </View>
        </ViewShot>

        {/* Answer Details */}
        {renderAnswerList(correctAnswers, 'Correct Answers', 'check-circle', colors.success)}
        {renderAnswerList(wrongAnswers, 'Wrong Answers', 'cancel', colors.error)}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handlePlayAgain}
            variant="primary"
            size="large"
            leftIcon={<MaterialIcons name="replay" size={22} color={colors.textInverse} />}
          >
            Play Again
          </Button>

          <Button
            onPress={handleBackToHome}
            variant="primary"
            size="large"
            leftIcon={<MaterialIcons name="home" size={22} color={colors.textInverse} />}
          >
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
  shareButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  captureContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  captureContent: {
    padding: spacing.lg,
    backgroundColor: colors.background,
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
  statItemLast: {
    borderBottomWidth: 0,
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
  brandingContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  brandingText: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    fontWeight: typography.weights.semibold,
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