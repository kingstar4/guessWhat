import categoryTable from '@/constants/categoryTable';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import CategoryCard from '../../components/ui/CartegoryCard';
import { fetchCategoryWords } from '../../services/api';
import { useGameStore } from '../../store/useGameStore';



const Category = () => {
  const router = useRouter();
  const { setSelectedCategory, setCategoryWords, selectedCategory } = useGameStore();

  // Fetch words for the selected category
  const { data: categoryWords, isLoading, error } = useQuery({
    queryKey: ['categoryWords', selectedCategory],
    queryFn: () => {
       if (!selectedCategory) throw new Error('No category selected');
        return fetchCategoryWords(selectedCategory);
  },
    enabled: !!selectedCategory, // Only fetch when a category is selected
  });

  // Set category words in store when data is fetched
  React.useEffect(() => {
    if (categoryWords) {
      setCategoryWords(categoryWords);
    }
  }, [categoryWords, setCategoryWords]);

  const handleCategorySelect = (categoryName: string) => {
    // Reset any previous selection if clicking the same category
    if (selectedCategory === categoryName.toLowerCase()) {
      setSelectedCategory(null);
    } else {
      const normalizedName = categoryName.toLowerCase();
      // Handle "Animals" -> "animal" conversion
      const apiEndpoint = normalizedName === "animals" ? "animal" : normalizedName;
      setSelectedCategory(apiEndpoint);
      console.log('Selected category:', apiEndpoint); // Debug log
    }
    router.push('/timer');
  };

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
      <View style={{flex: 1}}>  
        <FlatList 
          keyExtractor={(item)=> item.id.toString()} 
          numColumns={2} 
          scrollEnabled={true} 
          contentContainerStyle={styles.flatlist} 
          showsVerticalScrollIndicator={false} 
          data={categoryTable} 
          renderItem={({item}) => (
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
    // btn:{
    //     width: 150,
    //     ...Platform.select({
    //         ios: {
    //             shadowColor: '#000',
    //             shadowOffset: { width: 0, height: 2 },
    //             shadowOpacity: 0.3,
    //             shadowRadius: 4,
    //         },
    //         android: {
    //             elevation: 4,
    //         },
    //         web: {
    //             boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    //         },
    //     }),
    // },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
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