/**
 * Design Tokens for GuessWhat App
 * Clean, minimal design with cyan accent color
 */

// Color Palette
export const colors = {
    // Primary - Cyan accent
    primary: '#00BCD4',
    primaryLight: '#4DD0E1',
    primaryDark: '#0097A7',

    // Success - Green for correct answers
    success: '#2E7D32',
    successLight: '#4CAF50',
    successDark: '#1B5E20',

    // Error - Pink/Red for wrong answers
    error: '#FF5252',      // Tomato red
    errorLight: '#FF8A80', // Light tomato
    errorDark: '#D32F2F',  // Deep tomato

    // Neutrals
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceHover: '#F5F5F5',

    // Text
    text: '#212529',
    textSecondary: '#6C757D',
    textTertiary: '#ADB5BD',
    textInverse: '#FFFFFF',

    // Borders
    border: '#E9ECEF',
    borderLight: '#F1F3F5',
    borderDark: '#DEE2E6',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

// Typography
export const typography = {
    sizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 24,
        '2xl': 32,
        '3xl': 48,
        '4xl': 64,
    },
    weights: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const;

// Spacing (4px base unit)
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
} as const;

// Border Radius
export const borderRadius = {
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    full: 9999,
} as const;

// Shadows
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    base: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 5,
    },
} as const;

// Animation Durations (in milliseconds)
export const durations = {
    fast: 150,
    base: 250,
    slow: 350,
    slower: 500,
} as const;

// Spring Animation Configs
export const springConfigs = {
    default: {
        damping: 15,
        mass: 1,
        stiffness: 150,
    },
    gentle: {
        damping: 20,
        mass: 1,
        stiffness: 120,
    },
    wobbly: {
        damping: 10,
        mass: 1,
        stiffness: 180,
    },
    stiff: {
        damping: 26,
        mass: 1,
        stiffness: 300,
    },
} as const;

// Layout
export const layout = {
    maxWidth: 1200,
    containerPadding: spacing.base,
    cardPadding: spacing.lg,
} as const;

// Export default theme object
export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    durations,
    springConfigs,
    layout,
} as const;

export type Theme = typeof theme;
export default theme;
