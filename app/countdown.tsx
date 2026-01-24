import { useBack } from '@/hooks/useBack';
import { useGameStore } from '@/store/useGameStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const Countdown = () => {
    const router = useRouter();
    const selectedCategory = useGameStore((state) => state.selectedCategory);
    const [countDown, setCountDown] = useState(5);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const glowAnim = useRef(new Animated.Value(0)).current;

    useBack('/category');

    // Glowing animation for the number
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };

        lockOrientation();

        if (countDown > 0) {
            timeoutRef.current = setTimeout(() => {
                setCountDown((prev) => prev - 1);
            }, 1000);
        } else {
            router.push('/gameRoom');
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [countDown, router]);

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    return (
        <View style={styles.container}>
            {/* Header with branding */}
            <View style={styles.header}>
                <View style={styles.brandContainer}>
                    <Ionicons name="game-controller" size={20} color="#06b6d4" />
                    <Text style={styles.brandText}>{selectedCategory?.toUpperCase() || 'GUESS WHAT'}</Text>
                </View>
                <Ionicons name="settings-outline" size={24} color="#06b6d4" />
            </View>

            {/* Main content area - using flexDirection row for landscape */}
            <View style={styles.mainContent}>
                {/* Left side - GET READY text and countdown */}
                <View style={styles.leftSection}>
                    <Text style={styles.getReadyText}>GET READY</Text>

                    {countDown > 0 ? (
                        <View style={styles.countdownContainer}>
                            <Animated.View
                                style={[
                                    styles.glowEffect,
                                    { opacity: glowOpacity }
                                ]}
                            />
                            <Text style={styles.countdownNumber}>{countDown}</Text>
                        </View>
                    ) : (
                        <Text style={styles.letsGoText}>Let's Go! 😬</Text>
                    )}

                    <Text style={styles.instructionText}>Place the phone on{'\n'}your forehead</Text>
                </View>

                {/* Right side - Progress and Pro Tip */}
                <View style={styles.rightSection}>
                    {/* Progress bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${((5 - countDown) / 5) * 100}%` }]} />
                        </View>
                        <View style={styles.paginationDots}>
                            {[0, 1, 2].map((index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        index === 0 && styles.dotActive
                                    ]}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Pro tip card */}
                    <View style={styles.proTipCard}>
                        <View style={styles.proTipIconContainer}>
                            <Ionicons name="bulb" size={24} color="#fbbf24" />
                        </View>
                        <View style={styles.proTipContent}>
                            <Text style={styles.proTipTitle}>PRO TIP</Text>
                            <Text style={styles.proTipText}>
                                Tilt down for Correct, tilt up to Pass!
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Countdown;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    brandText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
        letterSpacing: 0.5,
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 40,
        paddingVertical: 20,
    },
    leftSection: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 20,
    },
    rightSection: {
        flex: 0.8,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingLeft: 20,
    },
    getReadyText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#06b6d4',
        letterSpacing: 6,
        marginBottom: 20,
    },
    countdownContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    glowEffect: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#06b6d4',
        opacity: 0.3,
    },
    countdownNumber: {
        fontSize: 140,
        fontWeight: '900',
        color: '#1f2937',
        textShadowColor: 'rgba(6, 182, 212, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    letsGoText: {
        fontSize: 48,
        fontWeight: '700',
        color: '#1f2937',
        marginVertical: 20,
    },
    instructionText: {
        fontSize: 18,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 26,
        marginTop: 10,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    progressBar: {
        width: '80%',
        height: 6,
        backgroundColor: '#e5e7eb',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#06b6d4',
        borderRadius: 3,
    },
    paginationDots: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#d1d5db',
    },
    dotActive: {
        backgroundColor: '#06b6d4',
    },
    proTipCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
        gap: 16,
        width: '90%',
    },
    proTipIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fef3c7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    proTipContent: {
        flex: 1,
    },
    proTipTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    proTipText: {
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 18,
    },
});