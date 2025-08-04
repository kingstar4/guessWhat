import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GameControls } from '../components/ui/ArrowButton';
import { useGameStore } from '../store/useGameStore';
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
    isGameActive
  } = useGameStore();
  
  const [timeLeft, setTimeLeft] = useState(selectedTime || 0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('loading');

  // Initialize game and timer
  useEffect(() => {
    // Lock the screen orientation to portrait
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
  // Assuming you have a setter in your store:
  useGameStore.getState().setCategoryWords(shuffledWords);

  startGame();
  setGameStatus('running');
  setTimeLeft(selectedTime);

  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        setGameStatus('ended');
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    clearInterval(timer);
    if (isGameActive) {
      endGame();
    }
    // Explicitly switch back to portrait
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  };
  }, []);

  // Handle game end (UI + navigation)
  useEffect(() => {
    if (gameStatus === 'ended') {
      endGame();

      const correctCount = getCorrectCount();
      const wrongCount = getWrongCount();

      Alert.alert(
        'Game Over!',
        `Final Score:\nCorrect: ${correctCount}\nWrong: ${wrongCount}`,
        [
          {
            text: 'Play Again',
            onPress: () => router.replace('/category')
          },
          {
            text: 'View Results',
            onPress: () => router.navigate('/result')
          }
        ]
      );
    }
  }, [gameStatus]);

  const handleAnswer = (isCorrect: boolean) => {
    const currentWord = getCurrentWord();
    if (!currentWord) return;

    if (isCorrect) addCorrectAnswer(currentWord);
    else addWrongAnswer(currentWord);

    if (hasMoreWords()) {
      nextWord();
    } else {
      setGameStatus('ended');
    }
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

  if (!currentWord) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No word available</Text>
      </View>
    );
  }

  return (
    <ScrollView>
          <View style={styles.container}>
            {/* Timer and Score */}
            <View style={styles.topBar}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  <MaterialIcons name='thumb-up' color='green' /> {getCorrectCount()} | <MaterialIcons name='thumb-down' color='red'/> {getWrongCount()}
                </Text>
              </View>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{timeLeft}s</Text>
              </View>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
              <View style={styles.wordContainer}>
                <Text style={styles.mainWord}>{currentWord.term}</Text>
              </View>

              <View style={styles.tabooContainer}>
                {/* <Text style={styles.tabooTitle}>{`Can't say:`}</Text> */}
                {currentWord.tabooWords.map((word, index) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center'}} key={index}>
                    <View key={index} style={styles.tabooWordContainer}>
                      <Text style={styles.tabooWord}>{word}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Game Controls */}
            <View style={styles.controlsSection}>
              <GameControls
                onCorrect={() => handleAnswer(true)}
                onWrong={() => handleAnswer(false)}
                disabled={timeLeft <= 0}
              />
            </View>
          </View>
    </ScrollView>
  );
};

export default GameRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  scoreContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  timerContainer: {
    backgroundColor: '#007AFF',
    width: 60,  
    height: 60, 
    borderRadius: 30,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainContent: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  mainWord: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: 20,
  },
  tabooContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40, 
  },
  tabooTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  tabooWordContainer: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 70,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tabooWord: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  controlsSection: {
    paddingBottom: 20,
  },
});
