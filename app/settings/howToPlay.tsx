import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';



const HowToPlay = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>How to Play Guess What!</Text>
        <Text style={styles.subtitle}>The Ultimate Word Guessing Game</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Game Objective</Text>
        <Text style={styles.text}>
          Help your team guess the main word by giving clues, but be careful - you cannot use any of the forbidden {`"taboo"`} words!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎮 How to Play</Text>
        
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1.</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Choose Your Category</Text>
            <Text style={styles.stepText}>Select from Animals, Celebrities, Sports, Countries, Food, Music, History, Actions, Science, Emotions, Art, or Geography.</Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>2.</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Set Your Timer</Text>
            <Text style={styles.stepText}>Choose how long you want to play: 30 seconds, 1 minute, 2 minutes, or 3 minutes.</Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>3.</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Give Clues</Text>
            <Text style={styles.stepText}>Describe the main word to your team without using any of the red taboo words shown below it.</Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>4.</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Score Points</Text>
            <Text style={styles.stepText}>Tap the green 😊 button when your team guesses correctly, or the red 😒 button if they {`can't`} guess or you use a taboo word.</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Game Rules</Text>
        
        <View style={styles.rule}>
          <Text style={styles.ruleIcon}>✅</Text>
          <Text style={styles.ruleText}>You CAN use gestures, sounds, and creative descriptions</Text>
        </View>

        <View style={styles.rule}>
          <Text style={styles.ruleIcon}>❌</Text>
          <Text style={styles.ruleText}>You CANNOT say any of the taboo words (shown in red)</Text>
        </View>

        <View style={styles.rule}>
          <Text style={styles.ruleIcon}>❌</Text>
          <Text style={styles.ruleText}>You CANNOT say the main word or parts of it</Text>
        </View>

        {/* <View style={styles.rule}>
          <Text style={styles.ruleIcon}>❌</Text>
          <Text style={styles.ruleText}>You CANNOT use rhyming words or {`"sounds like"`} clues</Text>
        </View> */}

        <View style={styles.rule}>
          <Text style={styles.ruleIcon}>⏰</Text>
          <Text style={styles.ruleText}>Keep an eye on the timer - when it runs out, the game ends!</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Scoring</Text>
        <Text style={styles.text}>
          • <Text style={styles.highlight}>Green 😊 (Correct):</Text> Your team guessed the word correctly{'\n'}
          • <Text style={styles.highlight}>Red 😒 (Wrong):</Text> Your team {`couldn't`} guess or you used a taboo word{'\n'}
          • Your final score shows how many words you got right!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Pro Tips</Text>
        <Text style={styles.text}>
          • Think of creative synonyms and descriptions{'\n'}
          • Use categories and examples {`(e.g., "It's a type of..."")`}{'\n'}
          • Act it out with gestures and expressions{'\n'}
          • Stay calm under pressure - the timer adds excitement!{'\n'}
          • Practice with different categories to improve your skills
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ready to play? Choose your category and start guessing!</Text>
      </View>
    </ScrollView>
  )
}

export default HowToPlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    marginHorizontal: -5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  step: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    width: 25,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
    marginLeft: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  stepText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleIcon: {
    fontSize: 16,
    width: 25,
    marginTop: 2,
  },
  ruleText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    flex: 1,
  },
  highlight: {
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#34C759',
    borderRadius: 12,
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
})