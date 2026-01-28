import { Image } from 'expo-image';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

// Background images
const portraitBg = require('../../assets/images/gwBg.png');
const landscapeBg = require('../../assets/images/gwMain.png');

interface ScreenBackgroundProps {
    children: ReactNode;
    /** Use landscape background (for game screens), defaults to portrait */
    variant?: 'portrait' | 'landscape';
    /** Additional styles for the container */
    style?: ViewStyle;
    /** Content container styles */
    contentStyle?: ViewStyle;
}

/**
 * ScreenBackground component provides a consistent background image 
 * for all screens with two variants:
 * - portrait: Uses gwBg.png (cyan circles on white) for portrait screens
 * - landscape: Uses gwMain.png (cyan waves) for landscape game screens
 */
export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({
    children,
    variant = 'portrait',
    style,
    contentStyle,
}) => {
    const backgroundImage = variant === 'landscape' ? landscapeBg : portraitBg;

    return (
        <View style={[styles.container, style]}>
            <Image
                source={backgroundImage}
                style={styles.backgroundImage}
                contentFit="cover"
                contentPosition="center"
            // resizeMode="cover"
            />
            <View style={[styles.content, contentStyle]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        opacity: 0.5,
    },
    content: {
        flex: 1,
    },
});

export default ScreenBackground;
