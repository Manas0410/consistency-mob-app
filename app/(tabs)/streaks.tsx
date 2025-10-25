import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import { usePallet } from '@/hooks/use-pallet';
import { useTheme } from '@/hooks/use-theme';
import { LinearGradient } from 'expo-linear-gradient';
import {
    BarChart3,
    BookOpen,
    Brain,
    Check,
    Download,
    Droplets,
    Leaf,
    Trophy
} from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface HabitItemProps {
  icon: React.ComponentType<any>;
  name: string;
  streak: number;
  maxStreak?: number;
  iconColor: string;
  iconBg: string;
}

const HabitItem: React.FC<HabitItemProps> = ({ 
  icon: IconComponent, 
  name, 
  streak, 
  maxStreak = 7, 
  iconColor,
  iconBg 
}) => {
  return (
    <View style={styles.habitItem}>
      <View style={[styles.habitIcon, { backgroundColor: iconBg }]}>
        <IconComponent size={20} color={iconColor} />
      </View>
      <View style={styles.habitInfo}>
        <Text variant="body" style={styles.habitName}>{name}</Text>
        <Text variant="caption" style={styles.habitStreak}>{streak} day streak</Text>
      </View>
      <View style={styles.habitProgress}>
        {Array.from({ length: maxStreak }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index < streak ? styles.progressDotActive : styles.progressDotInactive
            ]}
          />
        ))}
      </View>
    </View>
  );
};

interface CircularProgressProps {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;
  
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
};

export default function StreaksScreen() {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  const pallet = usePallet();

  // Mock data - replace with real data from your backend
  const currentStreak = 7;
  const todayTasks = 12;
  const weeklyTasks = 67;
  const streakProgress = currentStreak / 10; // Progress toward 10-day milestone

  const habits = [
    {
      icon: Droplets,
      name: "Drink water",
      streak: 7,
      iconColor: "#3B82F6",
      iconBg: "#DBEAFE"
    },
    {
      icon: BookOpen,
      name: "Read daily", 
      streak: 5,
      iconColor: "#10B981",
      iconBg: "#D1FAE5"
    },
    {
      icon: Brain,
      name: "Meditate",
      streak: 3,
      iconColor: "#8B5CF6", 
      iconBg: "#EDE9FE"
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with gradient */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text variant="heading" style={styles.headerTitle}>Streaks</Text>
              <Text style={styles.headerSubtitle}>Keep your momentum going 🔥</Text>
            </View>
            <Icon name={Download} size={24} color="white" />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Current Streak Card */}
          <Card style={styles.streakCard}>
            <View style={styles.streakContent}>
              <View style={styles.streakCircle}>
                <CircularProgress
                  progress={streakProgress}
                  size={120}
                  strokeWidth={6}
                  color={pallet.shade1}
                  backgroundColor="#E5E7EB"
                />
                <View style={styles.streakCenter}>
                  <Text style={styles.fireEmoji}>🔥</Text>
                  <Text style={styles.streakNumber}>{currentStreak}</Text>
                  <Text style={styles.streakLabel}>DAYS</Text>
                </View>
              </View>
              <Text variant="title" style={styles.streakTitle}>Current Streak</Text>
              <View style={styles.milestoneContainer}>
                <View style={styles.milestoneBullet} />
                <Text variant="caption" style={styles.milestoneText}>
                  3 days to 10-day milestone
                </Text>
              </View>
            </View>
          </Card>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={styles.statIconContainer}>
                  <Check size={20} color="#10B981" />
                </View>
                <Text style={styles.statNumber}>{todayTasks}</Text>
                <Text style={styles.statLabel}>TODAY</Text>
                <Text variant="caption" style={styles.statDescription}>Tasks completed</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '80%' }]} />
                </View>
              </View>
            </Card>

            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={styles.statIconContainer}>
                  <BarChart3 size={20} color={pallet.shade1} />
                </View>
                <Text style={styles.statNumber}>{weeklyTasks}</Text>
                <Text style={styles.statLabel}>WEEK</Text>
                <Text variant="caption" style={styles.statDescription}>Weekly tasks</Text>
                {/* Mini bar chart */}
                <View style={styles.miniChart}>
                  {[0.3, 0.5, 0.4, 0.8, 0.6, 0.9, 0.7].map((height, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.miniBar,
                        { 
                          height: height * 20,
                          backgroundColor: index === 6 ? pallet.shade1 : pallet.shade3
                        }
                      ]} 
                    />
                  ))}
                </View>
              </View>
            </Card>
          </View>

          {/* Active Habits */}
          <Card style={styles.habitsCard}>
            <View style={styles.habitsHeader}>
              <Text variant="title" style={styles.habitsTitle}>Active Habits</Text>
              <View style={styles.leafContainer}>
                <Leaf size={20} color="#10B981" />
              </View>
            </View>
            <View style={styles.habitsList}>
              {habits.map((habit, index) => (
                <HabitItem
                  key={index}
                  icon={habit.icon}
                  name={habit.name}
                  streak={habit.streak}
                  iconColor={habit.iconColor}
                  iconBg={habit.iconBg}
                />
              ))}
            </View>
          </Card>

          {/* Achievement Badge */}
          <LinearGradient
            colors={['#F59E0B', '#EA580C']}
            style={styles.achievementCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.achievementContent}>
              <Trophy size={32} color="white" />
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>Week Warrior</Text>
                <Text style={styles.achievementSubtitle}>7 consecutive days completed!</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20, // Overlap with header
    gap: 20,
    paddingBottom: 100, // Space for bottom navigation
  },
  streakCard: {
    padding: 24,
    alignItems: 'center',
  },
  streakContent: {
    alignItems: 'center',
  },
  streakCircle: {
    position: 'relative',
    marginBottom: 20,
  },
  streakCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fireEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 48,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  streakTitle: {
    marginBottom: 8,
    color: '#1F2937',
  },
  milestoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milestoneBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  milestoneText: {
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statIconContainer: {
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statDescription: {
    color: '#6B7280',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
  },
  miniBar: {
    width: 6,
    borderRadius: 3,
    minHeight: 4,
  },
  habitsCard: {
    padding: 20,
  },
  habitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  habitsTitle: {
    color: '#1F2937',
  },
  leafContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitsList: {
    gap: 16,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  habitStreak: {
    color: '#6B7280',
  },
  habitProgress: {
    flexDirection: 'row',
    gap: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: '#10B981',
  },
  progressDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  achievementCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
});
