import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { usePallet } from "@/hooks/use-pallet";
import { useColor } from "@/hooks/useColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

export interface OnboardingStep {
  id: string;
  title: string | React.ReactNode;
  description: string;
  image?: React.ReactNode;
  icon?: React.ReactNode;
  backgroundColor?: string;
  component?: React.ReactNode;
}

export interface OnboardingProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  showProgress?: boolean;
  swipeEnabled?: boolean;
  primaryButtonText?: string;
  skipButtonText?: string;
  nextButtonText?: string;
  backButtonText?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

// Enhanced Onboarding Step Component for complex layouts
interface OnboardingStepContentProps {
  step: OnboardingStep;
  isActive: boolean;
  children?: React.ReactNode;
}

export function Onboarding({
  steps,
  onComplete,
  onSkip,
  showSkip = true,
  showProgress = true,
  swipeEnabled = true,
  primaryButtonText = "Get Started",
  skipButtonText = "Skip",
  nextButtonText = "Next",
  backButtonText = "Back",
  style,
  children,
}: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const translateX = useSharedValue(0);

  const backgroundColor = useColor({}, "background");
  const primaryColor = useColor({}, "primary");
  const mutedColor = useColor({}, "mutedForeground");
  const textColor = useColor({}, "text");
  const pallet = usePallet();

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({
        x: nextStep * screenWidth,
        animated: true,
      });
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      scrollViewRef.current?.scrollTo({
        x: prevStep * screenWidth,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  // Modern gesture handling with Gesture API
  const panGesture = Gesture.Pan()
    .enabled(swipeEnabled)
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      const shouldSwipe =
        Math.abs(translationX) > screenWidth * 0.3 || Math.abs(velocityX) > 500;

      if (shouldSwipe) {
        if (translationX > 0 && !isFirstStep) {
          // Swipe right - go back
          runOnJS(handleBack)();
        } else if (translationX < 0 && !isLastStep) {
          // Swipe left - go next
          runOnJS(handleNext)();
        }
      }

      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderProgressDots = () => {
    if (!showProgress) return null;

    return (
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  index === currentStep ? primaryColor : mutedColor,
                opacity: index === currentStep ? 1 : 0.3,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStep = (step: OnboardingStep, index: number) => {
    const isActive = index === currentStep;

    return (
      <View
        key={step.id}
        style={[
          styles.stepContainer,
          { backgroundColor: step.backgroundColor || backgroundColor },
        ]}
      >
        <View style={styles.contentContainer}>
          {step.image && (
            <View style={styles.imageContainer}>{step.image}</View>
          )}

          {step.icon && !step.image && (
            <View style={styles.imageContainer}>{step.icon}</View>
          )}

          <View style={styles.textContainer}>
            {typeof step.title === "string" ? (
              <Text variant="title" style={styles.title}>
                {step.title}
              </Text>
            ) : (
              <View style={styles.titleWrapper}>
                <Text variant="title" style={styles.title}>
                  {step.title}
                </Text>
              </View>
            )}
            <Text
              variant="body"
              style={[styles.description, { color: mutedColor }]}
            >
              {step.description}
            </Text>
          </View>

          {step.component && (
            <View style={styles.componentContainer}>{step.component}</View>
          )}

          {children && <View style={styles.customContent}>{children}</View>}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleSkip}>
        <Ionicons name="close" size={32} color={textColor} />
      </TouchableOpacity>

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          bounces={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const newStep = Math.round(
              event.nativeEvent.contentOffset.x / screenWidth
            );
            setCurrentStep(newStep);
          }}
        >
          {steps.map((step, index) => renderStep(step, index))}
        </ScrollView>
      </View>

      {/* Progress Dots */}
      {renderProgressDots()}

      {/* Skip Button */}
      {showSkip && !isLastStep && (
        <View style={styles.skipContainer}>
          <Button variant="ghost" onPress={handleSkip}>
            {skipButtonText}
          </Button>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {!isFirstStep && (
          <Button
            variant="outline"
            onPress={handleBack}
            style={{ flex: 1 }}
            textStyle={{ fontSize: 14 }}
          >
            {backButtonText}
          </Button>
        )}

        <Button
          variant="default"
          onPress={handleNext}
          style={[
            styles.primaryButton,
            ...(isFirstStep ? [styles.fullWidthButton] : [{ flex: 2 }]),
          ]}
          textStyle={{ fontSize: 14 }}
        >
          {isLastStep ? primaryButtonText : nextButtonText}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  stepContainer: {
    width: screenWidth,
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 20,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    minHeight: 200,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  titleWrapper: {
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
    fontSize: 32,
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  componentContainer: {
    width: "100%",
    alignItems: "center",
  },
  customContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingBottom: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 1,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  skipContainer: {
    position: "absolute",
    top: 60,
    right: 10,
    zIndex: 1,
  },
  buttonContainer: {
    width: "100%",
    height: 90,
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  primaryButton: {
    // backgroundColor will be set by Button component using palette
  },
  fullWidthButton: {
    flex: 1,
  },
});

// Onboarding Hook for managing state
export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);

  const completeOnboarding = async () => {
    try {
      // In a real app, you'd save this to AsyncStorage or similar
      setHasCompletedOnboarding(true);
      console.log("Onboarding completed and saved");
    } catch (error) {
      console.error("Failed to save onboarding completion:", error);
    }
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    setCurrentOnboardingStep(0);
  };

  const skipOnboarding = async () => {
    await completeOnboarding();
  };

  return {
    hasCompletedOnboarding,
    currentOnboardingStep,
    setCurrentOnboardingStep,
    completeOnboarding,
    resetOnboarding,
    skipOnboarding,
  };
}
