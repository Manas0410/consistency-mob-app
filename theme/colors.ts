const lightColors = {
  // Base colors - Clean, modern backgrounds
  background: '#FAFAFA',
  foreground: '#0A0A0B',

  // Card colors - Subtle elevation with glass morphism
  card: '#FFFFFF',
  cardForeground: '#0A0A0B',

  // Popover colors
  popover: '#FFFFFF',
  popoverForeground: '#0A0A0B',

  // Primary colors - Modern blue-purple gradient
  primary: '#6366F1',
  primaryForeground: '#FFFFFF',

  // Secondary colors - Elegant neutrals
  secondary: '#F8FAFC',
  secondaryForeground: '#334155',

  // Muted colors - Better contrast ratios
  muted: '#F1F5F9',
  mutedForeground: '#64748B',

  // Accent colors - Vibrant but accessible
  accent: '#F1F5F9',
  accentForeground: '#475569',

  // Destructive colors - Modern red
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',

  // Border and input - Subtle and modern
  border: '#E2E8F0',
  input: '#F8FAFC',
  ring: '#6366F1',

  // Text colors - High contrast for accessibility
  text: '#0F172A',
  textMuted: '#64748B',
  textSecondary: '#94A3B8',

  // Legacy support for existing components
  tint: '#6366F1',
  icon: '#64748B',
  tabIconDefault: '#94A3B8',
  tabIconSelected: '#6366F1',

  // Modern color palette - iOS-inspired but more vibrant
  blue: '#3B82F6',
  blueLight: '#DBEAFE',

  // Success states - Fresh green
  green: '#10B981',
  greenLight: '#D1FAE5',

  // Error states - Balanced red
  red: '#EF4444',
  redLight: '#FEE2E2',

  // Warning states - Warm orange
  orange: '#F59E0B',
  orangeLight: '#FED7AA',

  // Info states - Bright yellow
  yellow: '#EAB308',
  yellowLight: '#FEF3C7',

  // Creative elements - Modern pink
  pink: '#EC4899',
  pinkLight: '#FCE7F3',

  // Premium features - Rich purple
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',

  // Communication - Calm teal
  teal: '#14B8A6',
  tealLight: '#CCFBF1',

  // System features - Deep indigo
  indigo: '#6366F1',
  indigoLight: '#E0E7FF',

  // Glass morphism and modern effects
  glass: 'rgba(255, 255, 255, 0.25)',
  glassBorder: 'rgba(255, 255, 255, 0.18)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
};

const darkColors = {
  // Base colors - True dark with subtle warmth
  background: '#0F0F10',
  foreground: '#F8FAFC',

  // Card colors - Elevated dark surfaces
  card: '#1A1A1B',
  cardForeground: '#F8FAFC',

  // Popover colors
  popover: '#1A1A1B',
  popoverForeground: '#F8FAFC',

  // Primary colors - Bright accent for dark mode
  primary: '#818CF8',
  primaryForeground: '#1E1B4B',

  // Secondary colors - Sophisticated dark grays
  secondary: '#1E293B',
  secondaryForeground: '#F1F5F9',

  // Muted colors - Balanced dark neutrals
  muted: '#1E293B',
  mutedForeground: '#94A3B8',

  // Accent colors
  accent: '#1E293B',
  accentForeground: '#F8FAFC',

  // Destructive colors
  destructive: '#F87171',
  destructiveForeground: '#7F1D1D',

  // Border and input - Subtle dark borders
  border: '#334155',
  input: '#1E293B',
  ring: '#818CF8',

  // Text colors - High contrast for dark mode
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textSecondary: '#64748B',

  // Legacy support for existing components
  tint: '#818CF8',
  icon: '#94A3B8',
  tabIconDefault: '#64748B',
  tabIconSelected: '#818CF8',

  // Modern dark mode palette
  blue: '#60A5FA',
  blueLight: '#1E3A8A',

  // Success states
  green: '#34D399',
  greenLight: '#064E3B',

  // Error states
  red: '#F87171',
  redLight: '#7F1D1D',

  // Warning states
  orange: '#FBBF24',
  orangeLight: '#92400E',

  // Info states
  yellow: '#FDE047',
  yellowLight: '#A16207',

  // Creative elements
  pink: '#F472B6',
  pinkLight: '#831843',

  // Premium features
  purple: '#A78BFA',
  purpleLight: '#581C87',

  // Communication
  teal: '#2DD4BF',
  tealLight: '#134E4A',

  // System features
  indigo: '#818CF8',
  indigoLight: '#1E1B4B',

  // Glass morphism and modern effects for dark mode
  glass: 'rgba(26, 26, 27, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.15)',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Export individual color schemes for easier access
export { darkColors, lightColors };

// Utility type for color keys
export type ColorKeys = keyof typeof lightColors;
