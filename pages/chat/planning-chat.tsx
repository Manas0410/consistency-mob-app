// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyPlannerData = {
  userId: 'user123',
  message: 'I want to improve my fitness this week.',
  planTasks: [
    {
      title: 'Morning Jog',
      subTitle: 'Jog for 30 minutes around park',
      taskDate: '02-10-2025',
      startTime: '06:00',
      endTime: '06:30',
      isDone: false,
      isHabbit: false
    },
    {
      title: 'Evening Yoga',
      subTitle: 'Relaxing yoga session for stress relief',
      taskDate: '02-10-2025',
      startTime: '18:00',
      endTime: '18:45',
      isDone: false,
      isHabbit: true
    },
    // Add more tasks...
  ],
  createdAt: new Date('2025-10-01T09:00:00Z')
};

const TaskCard = ({ task }) => (
  <View style={styles.taskCard}>
    <Text style={styles.taskTitle}>{task.title}</Text>
    <Text style={styles.taskSubtitle}>{task.subTitle}</Text>
    <View style={styles.taskTimeRow}>
      <Text style={styles.taskTime}>{task.taskDate}</Text>
      <Text style={styles.taskTime}>
        {task.startTime} - {task.endTime}
      </Text>
    </View>
    <Text style={{color: task.isDone ? 'green' : 'red'}}>
      {task.isDone ? 'Completed' : 'Pending'}
    </Text>
    <Text style={styles.habitLabel}>
      {task.isHabbit ? 'Habit' : ''}
    </Text>
  </View>
);

const PlannningChat = () => {
  const [plannerData, setPlannerData] = useState(null);

  useEffect(() => {
    // In real scenario fetch this data from API
    setPlannerData(dummyPlannerData);
  }, []);

  if (!plannerData) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.messageContainer}>
          <Text style={styles.userMessage}>{plannerData.message}</Text>
        </View>
        <FlatList
          data={plannerData.planTasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <TaskCard task={item} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          scrollEnabled={false} // So ScrollView manages scrolling
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { padding: 16 },

  messageContainer: {
    marginBottom: 20,
    alignSelf: 'flex-start',
    backgroundColor: '#e1f5fe',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMessage: {
    fontSize: 16,
    color: '#374151',
  },

  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  taskSubtitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#6b7280',
  },
  taskTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  taskTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  habitLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 4,
  },
});

export default PlannningChat;
