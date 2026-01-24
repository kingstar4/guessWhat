import { borderRadius, colors, shadows, spacing, typography } from '@/constants/designTokens';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { Chip } from '../components/ui/Chip';
import { CircularProgress } from '../components/ui/CircularProgress';
import { useGameStore } from '../store/useGameStore';
import { useSoundStore } from '../store/useSoundStore';
import shuffleArray from '../utils/shuffle';

type GameStatus = 'loading' | 'running' | 'ended';

const GameRoom = () => {
  const router = useRouter();
  const {
    selectedTime,
    categoryWords,
    getCurrentWord,
    nextWord,
    addCorrectAnswer,
    addWrongAnswer,
    startGame,
    endGame,
    getCorrectCount,
    getWrongCount,
    hasMoreWords,
    isGameActive,
    setSelectedCategory,
  } = useGameStore();

  const { playEffect } = useSoundStore();

  const [timeLeft, setTimeLeft] = useState(selectedTime || 0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('loading');
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize game and timer
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    lockOrientation();

    if (!selectedTime || !categoryWords || categoryWords.length === 0) {
      router.replace('/category');
      return;
    }

    // Shuffle the words before starting
    const shuffledWords = shuffleArray(categoryWords);
    useGameStore.getState().setCategoryWords(shuffledWords);

    startGame();
    setGameStatus('running');
    setTimeLeft(selectedTime);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (isGameActive) {
        endGame();
      }
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  // Separate effect for timer countdown
  useEffect(() => {
    if (gameStatus !== 'running') return;

    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setGameStatus('ended');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear interval when paused
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, gameStatus]);

  const handlePlayAgain = () => {
    setSelectedCategory(null);
    router.push('/category');
  };

  // Handle game end
  useEffect(() => {
    if (gameStatus === 'ended') {
      endGame();
      playEffect('timeup');

      const correctCount = getCorrectCount();
      const wrongCount = getWrongCount();

      Alert.alert(
        'Game Over!',
        `Final Score:\nCorrect: ${correctCount}\nWrong: ${wrongCount}`,
        [
          {
            text: 'Play Again',
            onPress: handlePlayAgain
          },
          {
            text: 'View Results',
            onPress: () => router.replace('/result')
          }
        ]
      );
    }
  }, [gameStatus, playEffect]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    const currentWord = getCurrentWord();
    if (!currentWord) return;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playEffect('success');
      addCorrectAnswer(currentWord);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      playEffect('wrong');
      addWrongAnswer(currentWord);
    }

    if (hasMoreWords()) {
      nextWord();
    } else {
      setGameStatus('ended');
    }
  }, [playEffect, getCurrentWord, addCorrectAnswer, addWrongAnswer, hasMoreWords, nextWord]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Loading state
  if (gameStatus === 'loading') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    );
  }

  const currentWord = getCurrentWord();
  const currentIndex = categoryWords?.findIndex(w => w.id === currentWord?.id) ?? 0;
  const totalWords = categoryWords?.length ?? 0;

  if (!currentWord) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No word available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Score Display */}
        <View style={styles.scoreDisplay}>
          <View style={styles.scoreBadge}>
            <MaterialIcons name="check-circle" size={24} color={colors.success} />
            <AnimatedNumber value={getCorrectCount()} style={styles.scoreNumber} />
          </View>

          <View style={[styles.scoreBadge, styles.scoreBadgeError]}>
            <MaterialIcons name="cancel" size={24} color={colors.error} />
            <AnimatedNumber value={getWrongCount()} style={styles.scoreNumber} />
          </View>
        </View>

        {/* Timer */}
        <CircularProgress
          timeLeft={timeLeft}
          totalTime={selectedTime || 0}
          size={70}
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.guessLabelContainer}>
          <Text style={styles.guessLabel}>GUESS THE WORD</Text>
        </View>
        <View style={styles.wordCard}>
          {/* <View style={styles.divider} /> */}
          <Text style={styles.mainWord}>{currentWord.term}</Text>
        </View>

        <View style={styles.tabooSection}>
          <Text style={styles.tabooLabel}>DON'T SAY</Text>
          <View style={styles.tabooChips}>
            {currentWord.tabooWords.map((word, index) => (
              <Chip
                key={index}
                label={word}
                variant="error"
                size="large"
              />
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {/* Pause Button */}
        <Pressable style={styles.pauseButton} onPress={togglePause}>
          <MaterialIcons
            name={isPaused ? "play-arrow" : "pause"}
            size={24}
            color={colors.primary}
          />
          <Text style={styles.pauseText}>{isPaused ? "RESUME" : "PAUSE"}</Text>
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleAnswer(false)}
          disabled={timeLeft <= 0 || isPaused}
        >
          <MaterialIcons name="close" size={32} color={colors.textInverse} />
          <Text style={styles.actionButtonText}>SKIP</Text>
          <Text style={styles.actionButtonSubtext}>-1 point</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.correctButton]}
          onPress={() => handleAnswer(true)}
          disabled={timeLeft <= 0 || isPaused}
        >
          <MaterialIcons name="check" size={32} color={colors.textInverse} />
          <Text style={styles.actionButtonText}>CORRECT</Text>
          <Text style={styles.actionButtonSubtext}>+1 point</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default GameRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.error,
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  roundCounter: {
    alignItems: 'flex-start',
  },
  roundLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  roundProgress: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },

  // Main Content
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordCard: {
    // backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    // paddingVertical: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guessLabel: {
    fontSize: typography.sizes.sm,
    color: colors.surface,
    textAlign: 'center',
    letterSpacing: 1,
  },
  guessLabelContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  mainWord: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    zIndex: 1,
  },

  // Taboo Section
  tabooSection: {
    alignItems: 'center',
  },
  tabooLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.error,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  tabooChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scoreDisplay: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    minWidth: 70,
    justifyContent: 'center',
    ...shadows.sm,
  },
  scoreBadgeError: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  scoreNumber: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  pauseText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    ...shadows.base,
  },
  passButton: {
    backgroundColor: colors.error,
  },
  correctButton: {
    backgroundColor: colors.success,
  },
  actionButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
    marginTop: spacing.xs,
  },
  actionButtonSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textInverse,
    opacity: 0.9,
  },
});
