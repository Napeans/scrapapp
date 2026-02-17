import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { askLocationPermission } from '../../permissions/location';
import { requestNotificationPermission } from '../../permissions/notification';

type Props = {
  onDone: () => void;
};

type PermissionStep = 'notification' | 'location';

type StepConfig = {
  key: PermissionStep;
  title: string;
  subtitle: string;
  allowLabel: string;
};

const steps: StepConfig[] = [
  {
    key: 'notification',
    title: 'Allow notifications?',
    subtitle: 'Get pickup status updates and important reminders.',
    allowLabel: 'Allow notifications',
  },
  {
    key: 'location',
    title: 'Allow location?',
    subtitle: 'Use your location to quickly set pickup address.',
    allowLabel: 'Allow location',
  },
];

const PermissionGate: React.FC<Props> = ({ onDone }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const translateY = useRef(new Animated.Value(380)).current;

  const currentStep = useMemo(() => steps[stepIndex], [stepIndex]);

  useEffect(() => {
    translateY.setValue(380);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [stepIndex, translateY]);

  const moveToNext = () => {
    Animated.timing(translateY, {
      toValue: 380,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      if (stepIndex >= steps.length - 1) {
        onDone();
      } else {
        setStepIndex(prev => prev + 1);
      }
    });
  };

  const handleAllow = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (currentStep.key === 'notification') {
        await requestNotificationPermission();
      }

      if (currentStep.key === 'location') {
        await askLocationPermission();
      }
    } catch (error) {
      console.log('Permission flow error', error);
    } finally {
      setIsLoading(false);
      moveToNext();
    }
  };

  const handleSkip = () => {
    if (isLoading) return;
    moveToNext();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundContent}>
        <Text style={styles.brand}>
          SCRAP<Text style={styles.gold}>2</Text>VALUE
        </Text>
        <Text style={styles.helper}>Set permissions to continue</Text>
      </View>

      <View style={styles.overlay} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.grabber} />

          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.subtitle}>{currentStep.subtitle}</Text>

          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={handleAllow}
            disabled={isLoading}
          >
            <Text style={styles.primaryText}>
              {isLoading ? 'Please wait...' : currentStep.allowLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip} disabled={isLoading}>
            <Text style={styles.secondaryText}>Not now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  backgroundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.6,
  },
  gold: {
    color: '#D4AF37',
  },
  helper: {
    marginTop: 14,
    color: '#7D7D7D',
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  grabber: {
    width: 46,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#D8D8D8',
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    color: '#101010',
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 44,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: '#5F6368',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PermissionGate;
