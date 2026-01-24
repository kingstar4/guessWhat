export interface CategoryItem {
    id: number;
    name: string;
    icon: string;
    iconLibrary: 'MaterialIcons' | 'MaterialCommunityIcons' | 'Ionicons';
    gradient: [string, string];
    tags: string[];
    wordCount?: number;
}

const categoryTable: CategoryItem[] = [
    {
        id: 1,
        name: 'Animals',
        icon: 'paw',
        iconLibrary: 'MaterialCommunityIcons',
        gradient: ['#4CAF50', '#2E7D32'],
        tags: ['all', 'kids', 'trending'],
        wordCount: 30,
    },
    {
        id: 2,
        name: 'Celebrity',
        icon: 'star',
        iconLibrary: 'MaterialIcons',
        gradient: ['#FF6B9D', '#C2185B'],
        tags: ['all', 'trending'],
        wordCount: 30,
    },
    {
        id: 3,
        name: 'Sports',
        icon: 'sports-basketball',
        iconLibrary: 'MaterialIcons',
        gradient: ['#FF9800', '#E65100'],
        tags: ['all', 'trending'],
        wordCount: 30,
    },
    {
        id: 4,
        name: 'Country',
        icon: 'earth',
        iconLibrary: 'MaterialCommunityIcons',
        gradient: ['#2196F3', '#0D47A1'],
        tags: ['all'],
        wordCount: 30,
    },
    {
        id: 5,
        name: 'Food',
        icon: 'restaurant',
        iconLibrary: 'MaterialIcons',
        gradient: ['#FFC107', '#F57C00'],
        tags: ['all', 'kids', 'trending'],
        wordCount: 30,
    },
    {
        id: 6,
        name: 'Music',
        icon: 'music-note',
        iconLibrary: 'MaterialIcons',
        gradient: ['#9C27B0', '#6A1B9A'],
        tags: ['all', 'trending'],
        wordCount: 30,
    },
    {
        id: 7,
        name: 'History',
        icon: 'history-edu',
        iconLibrary: 'MaterialIcons',
        gradient: ['#795548', '#4E342E'],
        tags: ['all'],
        wordCount: 30,
    },
    {
        id: 8,
        name: 'Action',
        icon: 'flash-on',
        iconLibrary: 'MaterialIcons',
        gradient: ['#f97316', '#c2410c'],
        tags: ['all', 'trending'],
        wordCount: 30,
    },
    {
        id: 9,
        name: 'Science',
        icon: 'science',
        iconLibrary: 'MaterialIcons',
        gradient: ['#00BCD4', '#00838F'],
        tags: ['all', 'kids'],
        wordCount: 30,
    },
    {
        id: 10,
        name: 'Emotion',
        icon: 'mood',
        iconLibrary: 'MaterialIcons',
        gradient: ['#E91E63', '#AD1457'],
        tags: ['all', 'kids'],
        wordCount: 30,
    },
    {
        id: 11,
        name: 'Art',
        icon: 'palette',
        iconLibrary: 'MaterialIcons',
        gradient: ['#673AB7', '#4527A0'],
        tags: ['all', 'kids'],
        wordCount: 30,
    },
    {
        id: 12,
        name: 'Bible',
        icon: 'book',
        iconLibrary: 'MaterialIcons',
        gradient: ['#8B4789', '#5E1B5D'],
        tags: ['all'],
        wordCount: 30,
    },
    {
        id: 13,
        name: 'Geography',
        icon: 'map',
        iconLibrary: 'MaterialIcons',
        gradient: ['#009688', '#00695C'],
        tags: ['all'],
        wordCount: 30,
    },
];

export default categoryTable;