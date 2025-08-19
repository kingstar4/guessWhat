import categoryTable from '@/constants/categoryTable';
import { useBack } from '@/hooks/useBack';
import { useWordBank } from '@/hooks/useWordBank';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import CategoryCard from '../../components/ui/CategoryCard';
import { useGameStore } from '../../store/useGameStore';


const Category = () => {
  const router = useRouter();
  const { setSelectedCategory, setCategoryWords, selectedCategory } = useGameStore();
  const hasSetWord = useRef(false);
  const {words, isLoading, error}= useWordBank({ autoSync:true, mergeStrategy: 'replace'});
  useBack('/home');
  // Reset the ref when the screen comes back into focus (e.g., navigating back from timer)
  useFocusEffect(
    useCallback(() => {
      // Reset the ref when the screen is focused
      hasSetWord.current = false;
      console.log('Category screen focused, reset hasSetWord');
    }, [])
  );

  // Set category words in store when data is fetched
  useEffect(() => {

    setSelectedCategory(null);
    if (selectedCategory && words && !hasSetWord.current) {
      const categoryWords = words[selectedCategory] || [];
      setCategoryWords(categoryWords);
      console.log("Setting categoryWords for", selectedCategory, ":", categoryWords.length, "words");
      hasSetWord.current = true;
      router.push('/timer');
    }
  }, [selectedCategory, words, setCategoryWords, router, setSelectedCategory]);

  const handleCategorySelect = useCallback((categoryName: string) => {
  
    const normalize = categoryName.toLowerCase();
    
    // Reset any previous selection if clicking the same category
    if (selectedCategory === normalize) {
      setSelectedCategory(null);
      hasSetWord.current = false;
      console.log('Reset category selection');
    } else {
      // Reset the ref when selecting a new category
      hasSetWord.current = false;
      setSelectedCategory(normalize);
      console.log('Selected category:', normalize);
    }
  }, [selectedCategory, setSelectedCategory])

  if (error) {
    console.error('Error details:', error); // Debug log
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading categories:</Text>
        <Text style={styles.errorMessage}>{(error as Error).message}</Text>
        <Text style={styles.errorHint}>Make sure json-server is running on port 3000</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 1, paddingBottom:30, marginBottom: 10}}>  
        <FlatList 
          keyExtractor={(item)=> item.id.toString()} 
          numColumns={2} 
          scrollEnabled={true} 
          contentContainerStyle={styles.flatlist} 
          showsVerticalScrollIndicator={false} 
          initialNumToRender={4}
          removeClippedSubviews={true}
          data={categoryTable} 
          renderItem={({item}:any)=>(
            <CategoryCard 
              img={item.picture} 
              text={item.name}
              onPress={() => handleCategorySelect(item.name)}
            />
          )}
        />

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{fontWeight:'bold'}}>Loading Categories...</Text>
          </View>
        )}
          
      </View>

    </View>
  )
}

export default Category;

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    flatlist:{
        alignItems:'center', 
        justifyContent:'space-between',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(255,255,255)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedCategoryOverlay: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 10,
    },
    selectedText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    errorHint: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    }
})