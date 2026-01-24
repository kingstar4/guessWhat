import categoryTable from '@/constants/categoryTable';
import { borderRadius, colors, shadows, spacing, typography } from '@/constants/designTokens';
import { useBack } from '@/hooks/useBack';
import { useWordBank } from '@/hooks/useWordBank';
import { useSoundStore } from '@/store/useSoundStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CategoryCard from '../../components/ui/CategoryCard';
import { useGameStore } from '../../store/useGameStore';

type FilterType = 'all' | 'trending' | 'kids';

const Category = () => {
  const router = useRouter();
  const { setSelectedCategory, setCategoryWords, selectedCategory } = useGameStore();
  const hasSetWord = useRef(false);
  const { words, isLoading, error } = useWordBank();
  const playEffect = useSoundStore((s) => s.playEffect);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useBack('/home');

  useFocusEffect(
    useCallback(() => {
      hasSetWord.current = false;
      setSelectedCategory(null);
    }, [setSelectedCategory])
  );

  useEffect(() => {
    if (selectedCategory && words && !hasSetWord.current) {
      const categoryWords = words[selectedCategory] || [];
      setCategoryWords(categoryWords);
      hasSetWord.current = true;
      router.push('/timer');
    }
  }, [selectedCategory, words]);

  const handleCategorySelect = useCallback((categoryName: string) => {
    playEffect('click');
    const normalize = categoryName.toLowerCase();

    if (selectedCategory === normalize) {
      setSelectedCategory(null);
      hasSetWord.current = false;
    } else {
      hasSetWord.current = false;
      setSelectedCategory(normalize);
    }
  }, [selectedCategory, setSelectedCategory, playEffect]);

  const handleBackPress = () => {
    playEffect('click');
    router.back();
  };

  const handleFilterChange = (filter: FilterType) => {
    playEffect('click');
    setActiveFilter(filter);
  };

  // Filter categories based on search and active filter
  const filteredCategories = categoryTable.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = category.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  if (error) {
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
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Category</Text>
        <Text style={styles.subtitle}>Choose a deck to start the fun!</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
          onPress={() => handleFilterChange('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
            All Decks
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterTab, activeFilter === 'trending' && styles.filterTabActive]}
          onPress={() => handleFilterChange('trending')}
        >
          <Text style={[styles.filterText, activeFilter === 'trending' && styles.filterTextActive]}>
            Trending
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterTab, activeFilter === 'kids' && styles.filterTabActive]}
          onPress={() => handleFilterChange('kids')}
        >
          <Text style={[styles.filterText, activeFilter === 'kids' && styles.filterTextActive]}>
            Kids
          </Text>
        </Pressable>
      </View>

      {/* Category Grid */}
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={styles.flatlist}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        removeClippedSubviews={true}
        data={filteredCategories}
        renderItem={({ item }) => (
          <CategoryCard
            icon={item.icon}
            iconLibrary={item.iconLibrary}
            gradient={item.gradient}
            text={item.name}
            wordCount={item.wordCount}
            onPress={() => handleCategorySelect(item.name)}
            selected={selectedCategory === item.name.toLowerCase()}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No categories found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        }
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Categories...</Text>
        </View>
      )}
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xl,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.sm,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: typography.sizes.base,
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  filterTextActive: {
    color: colors.textInverse,
  },
  flatlist: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    gap: spacing.base,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.base,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.error,
    marginBottom: spacing.md,
  },
  errorMessage: {
    fontSize: typography.sizes.base,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});