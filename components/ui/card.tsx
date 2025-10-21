import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColor } from "@/hooks/useColor";
import { RADIUS, SHADOWS, SPACING } from "@/theme/globals";
import { TextStyle, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'glass';
  shadow?: 'none' | 'sm' | 'base' | 'md' | 'lg';
}

export function Card({ children, style, variant = 'default', shadow = 'base' }: CardProps) {
  const cardColor = useColor({}, "card");
  const glassColor = useColor({}, "glass");
  const glassBorderColor = useColor({}, "glassBorder");

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: "100%",
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
    };

    const shadowStyle = shadow !== 'none' ? SHADOWS[shadow] : {};

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: cardColor,
          ...SHADOWS.lg,
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: glassColor,
          borderWidth: 1,
          borderColor: glassBorderColor,
          ...shadowStyle,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: cardColor,
          ...shadowStyle,
        };
    }
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[{ marginBottom: SPACING.sm }, style]}>{children}</View>;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function CardTitle({ children, style }: CardTitleProps) {
  return (
    <Text
      variant="title"
      style={[
        {
          marginBottom: SPACING.xs,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  return (
    <Text variant="caption" style={[style]}>
      {children}
    </Text>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[style]}>{children}</View>;
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardFooter({ children, style }: CardFooterProps) {
  return (
    <View
      style={[
        {
          marginTop: SPACING.md,
          flexDirection: "row",
          gap: SPACING.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
