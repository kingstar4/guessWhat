import { create } from 'zustand';

interface GameWord {
  id: number;
  term: string;
  tabooWords: string[];
}

interface AnswerRecord {
  word: GameWord;
  timestamp: number;
}

interface GameState {
  selectedTime: number | null;
  categoryWords: GameWord[] | null;
  currentWordIndex: number;
  selectedCategory: string | null;
  correctAnswers: AnswerRecord[];
  wrongAnswers: AnswerRecord[];
  gameStartTime: number | null;
  gameEndTime: number | null;
  isGameActive: boolean;
  
  // Actions
  setSelectedTime: (time: number) => void;
  setCategoryWords: (words: GameWord[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setCurrentWordIndex: (index: number) => void;
  nextWord: () => void;
  addCorrectAnswer: (word: GameWord) => void;
  addWrongAnswer: (word: GameWord) => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  
  // Getters
  getTotalScore: () => number;
  getCorrectCount: () => number;
  getWrongCount: () => number;
  getCurrentWord: () => GameWord | null;
  hasMoreWords: () => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  selectedTime: null,
  categoryWords: null,
  currentWordIndex: 0,
  selectedCategory: null,
  correctAnswers: [],
  wrongAnswers: [],
  gameStartTime: null,
  gameEndTime: null,
  isGameActive: false,
  
  setSelectedTime: (time) => {
    console.log('Setting selectedTime:', time);
    set({ selectedTime: time });
  },
  
  setCategoryWords: (words) => {
    console.log('Setting categoryWords:', words?.length, 'words');
    set({ categoryWords: words, currentWordIndex: 0 });
  },
  
  setSelectedCategory: (category: string | null) => {
    console.log('Setting selectedCategory:', category);
    set({ selectedCategory: category });
  },
  
  setCurrentWordIndex: (index) => {
    set({ currentWordIndex: index });
  },
  
  nextWord: () => {
    const { currentWordIndex, categoryWords } = get();
    if (categoryWords && currentWordIndex < categoryWords.length - 1) {
      set({ currentWordIndex: currentWordIndex + 1 });
      return true; // Has more words
    }
    return false; // No more words
  },
  
  addCorrectAnswer: (word) => {
    const correctAnswer: AnswerRecord = {
      word,
      timestamp: Date.now(),
    };
    set((state) => ({
      correctAnswers: [...state.correctAnswers, correctAnswer],
    }));
    console.log('Added correct answer:', word.term);
  },
  
  addWrongAnswer: (word) => {
    const wrongAnswer: AnswerRecord = {
      word,
      timestamp: Date.now(),
    };
    set((state) => ({
      wrongAnswers: [...state.wrongAnswers, wrongAnswer],
    }));
    console.log('Added wrong answer:', word.term);
  },
  
  startGame: () => {
    set({
      gameStartTime: Date.now(),
      isGameActive: true,
      correctAnswers: [],
      wrongAnswers: [],
      currentWordIndex: 0,
    });
    console.log('Game started');
  },
  
  endGame: () => {
    set({
      gameEndTime: Date.now(),
      isGameActive: false,
    });
    console.log('Game ended');
  },
  
  resetGame: () => {
    set({
      selectedTime: null,
      categoryWords: null,
      currentWordIndex: 0,
      selectedCategory: null,
      correctAnswers: [],
      wrongAnswers: [],
      gameStartTime: null,
      gameEndTime: null,
      isGameActive: false,
    });
    console.log('Game reset');
  },
  
  // Getters
  getTotalScore: () => {
    const { correctAnswers } = get();
    return correctAnswers.length;
  },
  
  getCorrectCount: () => {
    const { correctAnswers } = get();
    return correctAnswers.length;
  },
  
  getWrongCount: () => {
    const { wrongAnswers } = get();
    return wrongAnswers.length;
  },
  
  getCurrentWord: () => {
    const { categoryWords, currentWordIndex } = get();
    return categoryWords?.[currentWordIndex] || null;
  },
  
  hasMoreWords: () => {
    const { categoryWords, currentWordIndex } = get();
    return categoryWords ? currentWordIndex < categoryWords.length - 1 : false;
  },
}));