import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { GameControls } from '../components/ui/ArrowButton';
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
  },[]);

  const handlePlayAgain = () =>{
    setSelectedCategory(null);
    router.push('/category');
    console.log("Reset Category");
  }
  // Handle game end (UI + navigation)
  useEffect(() => {
    if (gameStatus === 'ended') {
      endGame();
      
      // Play timeup sound when game ends
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

    // Play appropriate sound effect
    if (isCorrect) {
      playEffect('success');
      addCorrectAnswer(currentWord);
    } else {
      playEffect('wrong');
      addWrongAnswer(currentWord);
    }

    if (hasMoreWords()) {
      nextWord();
    } else {
      setGameStatus('ended');
    }
  },[playEffect, getCurrentWord, addCorrectAnswer, addWrongAnswer, hasMoreWords, nextWord]);

  const localSource = require('../assets/videos/game.mp4');
  const player= useVideoPlayer(localSource, (player)=>{
    player.loop= true;
    player.play();
    player.muted= true;
  })

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
      <View style={styles.container}>
        <VideoView player={player} allowsFullscreen style={styles.video} contentFit='cover' nativeControls={false}/>
        <View style={styles.overlay}/>
        <View style={styles.contentContainer}>
        {/* Timer and Score */}
        <View style={styles.topBar}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              <MaterialIcons name='thumb-up' color='green' size={15} /> {getCorrectCount()} | <MaterialIcons name='thumb-down' color='red' size={15}/> {getWrongCount()}
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
      </View>
  );
};

export default GameRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    paddingVertical:0,
    paddingHorizontal: 20,
  },
  contentContainer:{
    flex:1,
    zIndex:2,
    padding:10,
  },
  overlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    zIndex: 1,
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
    textAlign: 'center',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  mainWord: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    paddingHorizontal: 20,
  },
  tabooContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30, 
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
    paddingBottom: 30,
    zIndex:3,
  },
  video:{
   position: 'absolute',
   top:0,
   bottom:0,
   left:0,
   right:0, 
  }
});
