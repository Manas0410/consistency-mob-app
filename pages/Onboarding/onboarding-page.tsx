import { Image } from "@/components/ui/image";
import { Onboarding, OnboardingStep } from "@/components/ui/onboarding";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import React from "react";

export function OnboardingFlow() {
  const { completeOnboarding, skipOnboarding, setCurrentOnboardingStep } =
    useOnboardingContext();

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
