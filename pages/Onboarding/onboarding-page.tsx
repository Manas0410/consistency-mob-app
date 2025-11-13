const OnboardingPage = () => {};

export default OnboardingPage;
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import {
  Onboarding,
  OnboardingStep,
  useOnboarding,
} from "@/components/ui/onboarding";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import React from "react";

function MainApp() {
  const { resetOnboarding } = useOnboarding();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8fafc",
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        {/* <Text>{}</Text> */}
        <Text variant="heading" style={{ marginTop: 20, textAlign: "center" }}>
          Welcome to the App!
        </Text>
        <Text
          variant="body"
          style={{
            marginTop: 12,
            textAlign: "center",
            color: "#64748b",
            lineHeight: 22,
          }}
        >
          You've successfully completed the onboarding process. You can restart
          it anytime using the button below.
        </Text>
      </View>

      <Button
        onPress={resetOnboarding}
        variant="outline"
        style={{ paddingHorizontal: 24 }}
      >
        🔄 Restart Onboarding
      </Button>
    </View>
  );
}

function OnboardingFlow() {
  const { completeOnboarding, skipOnboarding } = useOnboarding();

  const WelcomeImage = () => (
    <Image
      source={{
        uri: "https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
      width={300}
      aspectRatio={1}
      variant="circle"
    />
  );
  const FeaturesImage = () => (
    <Image
      source={{
        uri: "https://images.unsplash.com/photo-1644190022446-04b99df7259a?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
      width={300}
      aspectRatio={1}
    />
  );
  const StartImage = () => (
    <Image
      source={{
        uri: "https://images.unsplash.com/photo-1575737698350-52e966f924d4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
      width={420}
      aspectRatio={9 / 14}
    />
  );
  const steps: OnboardingStep[] = [
    {
      id: "1",
      title: "Welcome to the Team",
      description:
        "Join thousands of users who have already discovered the power of our platform.",
      image: <WelcomeImage />,
    },
    {
      id: "2",
      title: "Powerful Features",
      description:
        "Access advanced tools and features that will help you achieve your goals faster.",
      image: <FeaturesImage />,
    },
    {
      id: "3",
      title: "Ready to Launch",
      description:
        "Everything is set up and ready. Let's start building something amazing together!",
      image: <StartImage />,
    },
  ];

  return (
    <Onboarding
      steps={steps}
      onComplete={completeOnboarding}
      onSkip={skipOnboarding}
      primaryButtonText="Complete & Continue"
      nextButtonText="Next Step"
      skipButtonText="Skip Demo"
    />
  );
}

export function OnboardingHook() {
  const { hasCompletedOnboarding } = useOnboarding();

  return hasCompletedOnboarding ? <MainApp /> : <OnboardingFlow />;
}
