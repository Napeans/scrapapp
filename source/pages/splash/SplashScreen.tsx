import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationFinished }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const shimmerAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: width,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      onAnimationFinished();
    }, 3500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, shimmerAnim, onAnimationFinished]);

  return (
    <View style={styles.mainWrapper}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.logoContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.logoText}>
              SCRAP<Text style={styles.goldText}>2</Text>VALUE
            </Text>
            <Text style={styles.tagline}>REFINING TRASH INTO TREASURE</Text>

            <Animated.View
              style={[
                styles.shimmer,
                { transform: [{ translateX: shimmerAnim }] },
              ]}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    padding: 30,
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F5F5F5',
    letterSpacing: 4,
  },
  goldText: {
    color: '#D4AF37',
  },
  tagline: {
    fontSize: 10,
    color: '#8E8E8E',
    letterSpacing: 3,
    marginTop: 10,
    fontWeight: '300',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
});

export default SplashScreen;
