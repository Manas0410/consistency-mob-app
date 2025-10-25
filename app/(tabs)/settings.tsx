import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import { usePallet } from '@/hooks/use-pallet';
import { useTheme } from '@/hooks/use-theme';
import {
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Moon,
  Palette,
  Shield,
  Star,
  User
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const accentColors = [
  { color: '#6366F1', name: 'Indigo' },
  { color: '#374151', name: 'Gray' },
  { color: '#10B981', name: 'Green' },
  { color: '#F97316', name: 'Orange' },
  { color: '#EF4444', name: 'Red' },
  { color: '#8B5CF6', name: 'Purple' },
];

interface SettingItemProps {
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  rightContent?: React.ReactNode;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon: IconComponent,
  iconColor,
  iconBg,
  title,
  subtitle,
  rightContent,
  onPress
}) => {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <Card style={styles.settingCard}>
        <View style={styles.settingContent}>
          <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
            <IconComponent size={20} color={iconColor} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              {title}
            </Text>
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          </View>
          {rightContent && (
            <View style={styles.settingRight}>
              {rightContent}
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const theme = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  const pallet = usePallet();

  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedAccentColor, setSelectedAccentColor] = useState(0);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const ThemeToggleButtons = () => (
    <View style={styles.themeToggleContainer}>
      {[
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Auto", value: "auto" },
      ].map((item) => (
        <TouchableOpacity
          key={item.value}
          style={[
            styles.themeToggleButton,
            selectedTheme === item.value && {
              backgroundColor: pallet.shade1,
            },
            selectedTheme !== item.value && {
              backgroundColor: colors.background,
              borderColor: '#E5E7EB',
              borderWidth: 1,
            }
          ]}
          onPress={() => setSelectedTheme(item.value)}
        >
          <Text
            style={[
              styles.themeToggleText,
              {
                color: selectedTheme === item.value ? 'white' : colors.text,
                fontWeight: selectedTheme === item.value ? '600' : '400',
              }
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const AccentColorPicker = () => (
    <View style={styles.colorPickerContainer}>
      {accentColors.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.colorCircle,
            {
              backgroundColor: item.color,
              borderWidth: selectedAccentColor === index ? 3 : 0,
              borderColor: selectedAccentColor === index ? pallet.shade1 : 'transparent',
            }
          ]}
          onPress={() => setSelectedAccentColor(index)}
        >
          {selectedAccentColor === index && (
            <View style={styles.colorCheckmark}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const CustomToggle = ({ value, onValueChange }: { value: boolean; onValueChange: (value: boolean) => void }) => (
    <TouchableOpacity
      style={[
        styles.customToggle,
        { backgroundColor: value ? pallet.shade1 : '#E5E7EB' }
      ]}
      onPress={() => onValueChange(!value)}
    >
      <View
        style={[
          styles.customToggleThumb,
          {
            transform: [{ translateX: value ? 20 : 2 }],
            backgroundColor: 'white'
          }
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        </View>
        
        {/* Profile Section */}
        <View style={styles.profileCardWrapper}>
          <Card style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarContainer}>
                <User size={20} color={colors.text} />
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.nameContainer}>
                  <Text 
                    style={[styles.profileName, { color: colors.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Sanskrati
                  </Text>
                  <View style={styles.proBadge}>
                    <Text style={styles.proText}>Pro</Text>
                  </View>
                </View>
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                  sanskrati@25hours.app
                </Text>
                <View style={styles.statusIndicator}>
                  <View style={styles.onlineDot} />
                  <Text style={[styles.statusText, { color: colors.textSecondary }]}>Online</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Card>
        </View>

        <View style={styles.settingsContainer}>
          {/* Subscription */}
          <SettingItem
            icon={Star}
            iconColor="#6366F1"
            iconBg="#E0E7FF"
            title="Subscription"
            subtitle="Pro Plan • Active"
            rightContent={<ChevronRight size={16} color={colors.textSecondary} />}
            onPress={() => console.log('Subscription pressed')}
          />

          {/* Theme */}
          <Card style={styles.themeCard}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#1F2937' }]}>
                <Moon size={20} color="white" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Theme
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  Choose your appearance
                </Text>
              </View>
            </View>
            <ThemeToggleButtons />
          </Card>

          {/* Accent Color */}
          <Card style={styles.colorCard}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#8B5CF6' }]}>
                <Palette size={20} color="white" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Accent Color
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  Personalize your interface
                </Text>
              </View>
            </View>
            <AccentColorPicker />
          </Card>

          {/* Reminders */}
          <Card style={styles.reminderCard}>
            <View style={styles.settingContent}>
              <View style={[styles.settingIcon, { backgroundColor: '#F97316' }]}>
                <Clock size={20} color="white" />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Reminders
                </Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                  Never miss a task
                </Text>
              </View>
              <CustomToggle 
                value={remindersEnabled} 
                onValueChange={setRemindersEnabled} 
              />
            </View>
            
            {remindersEnabled && (
              <TouchableOpacity style={styles.customSchedule}>
                <Text style={[styles.customScheduleTitle, { color: colors.text }]}>
                  Custom Schedule
                </Text>
                <View style={styles.customScheduleRight}>
                  <Text style={[styles.scheduleTime, { color: colors.textSecondary }]}>
                    Daily at 9:00 AM
                  </Text>
                  <ChevronRight size={16} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            )}
          </Card>

          {/* Notifications */}
          <SettingItem
            icon={Download}
            iconColor="white"
            iconBg="#10B981"
            title="Notifications"
            subtitle="Tasks, streaks & achievements"
            rightContent={
              <CustomToggle 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled} 
              />
            }
          />

          {/* Privacy & Security */}
          <SettingItem
            icon={Shield}
            iconColor="white"
            iconBg="#374151"
            title="Privacy & Security"
            subtitle="Manage your data"
            rightContent={<ChevronRight size={16} color={colors.textSecondary} />}
            onPress={() => console.log('Privacy pressed')}
          />
        </View>

        {/* Sign Out and Version */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            25hours v2.1.0
          </Text>
        </View>

        {/* Bottom padding for navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  profileCardWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  profileCard: {
    padding: 16,
    width: '100%',
    alignSelf: 'stretch',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0, // Allow text to shrink
    maxWidth: '75%', // Ensure space for edit button
    overflow: 'hidden',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0, // Don't allow avatar to shrink
  },
  profileInfo: {
    flex: 1,
    minWidth: 0, // Allow text to shrink and wrap
    maxWidth: '100%',
    overflow: 'hidden',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    maxWidth: 120,
    flexShrink: 1,
  },
  proBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    flexShrink: 0, // Don't allow badge to shrink
  },
  proText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '400',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 12,
  },
  settingsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 20,
  },
  settingCard: {
    padding: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  settingSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  settingRight: {
    marginLeft: 16,
  },
  themeCard: {
    padding: 16,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  themeToggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  colorCard: {
    padding: 16,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
    flexWrap: 'wrap',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCheckmark: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reminderCard: {
    padding: 16,
  },
  customSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  customScheduleTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  customScheduleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleTime: {
    fontSize: 13,
  },
  customToggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  customToggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bottomSection: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 20,
  },
  signOutButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  signOutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
  },
  bottomPadding: {
    height: 100,
  },
});
