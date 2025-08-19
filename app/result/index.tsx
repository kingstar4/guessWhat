import { useBack } from '@/hooks/useBack';
import { usePortraitLock } from '@/hooks/usePortrait';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

  const renderAnswerList = (answers: typeof correctAnswers, title: string, color: string) => (
    <View style={styles.answerSection}>
      <Text style={[styles.sectionTitle, { color }]}>{title} ({answers.length})</Text>
      {answers.length === 0 ? (
        <Text style={styles.emptyText}>No {title.toLowerCase()} answers</Text>
      ) : (
        <View style={styles.answerList}>
          {answers.map((answer, index) => (
            <View key={index} style={[styles.answerItem, { borderColor: color }]}>
              <Text style={styles.answerTerm}>{answer.word.term}</Text>
              <Text style={styles.answerTaboo}>
                Taboo: {answer.word.tabooWords.join(', ')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    <StatusBar hidden={true}/>
      
      <View style={styles.header}>
        <Text style={styles.title}>Game Results</Text>
        <Text style={styles.category}>{selectedCategory?.toUpperCase()}</Text>
      </View>

      {/* Score Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreNumber}>{correctAnswers.length}</Text>
          <Text style={styles.scoreLabel}>Correct</Text>
        </View>
        
        <View style={styles.scoreCard}>
          <Text style={styles.scoreNumber}>{wrongAnswers.length}</Text>
          <Text style={styles.scoreLabel}>Wrong</Text>
        </View>
        
        <View style={styles.scoreCard}>
          <Text style={styles.scoreNumber}>{accuracy}%</Text>
          <Text style={styles.scoreLabel}>Accuracy</Text>
        </View>
      </View>

      {/* Game Stats */}
      <View style={styles.statsContainer}>
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
      </View>

      {/* Answer Details */}
      {renderAnswerList(correctAnswers, 'Correct Answers', '#34C759')}
      {renderAnswerList(wrongAnswers, 'Wrong Answers', '#FF3B30')}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.primaryButton]} onPress={handlePlayAgain}>
          <Text style={styles.primaryButtonText}>Play Again</Text>
        </Pressable>
        
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleBackToHome}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default GameResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  scoreCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 80,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  answerSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  answerList: {
    gap: 10,
  },
  answerItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
    }),
  },
  answerTerm: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  answerTaboo: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    gap: 15,
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});