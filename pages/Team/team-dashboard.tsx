import { ParallaxScrollView } from '@/components/ui/parallax-scrollview';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

const pieData = [
    { value: 50, color: "#17c964" },
    { value: 30, color: "#4299e1" },
    { value: 20, color: "#F87171 " },
];

function TeamDashboard() {
    // Example stats
    const completedCount = 72;
    const totalCount = 120;
    const stats = [
        { label: 'Completed', value: completedCount , color: '#17c964' },
        { label: 'Remaining', value: totalCount - completedCount, color: '#F87171 ' },
        { label: 'Assigned', value: 20, color: '#4299e1' },
    ];

    const handlePress = (route: string) => {
        // Implement navigation e.g., router.push(route)
        console.log('Navigate to', route);
    };

    return (
        <ParallaxScrollView
            headerHeight={460}
            headerImage={
                <Image
                    source={{
                        uri: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit='cover'
                />
            }
        >
            <View style={{ gap: 16 }}>
                {/* TOP CARD with chart + stats */}
                <View style={styles.card}>
                    <Text style={styles.overviewLabel}>Task Overview</Text>
                    <Text style={styles.count}>{totalCount}</Text>
                    <Text style={styles.monthProgress}>This Month <Text style={{ color: '#17c964', fontWeight: 'bold' }}>+15%</Text></Text>

                    <View style={styles.chartRow}>
                        <View style={styles.chartBox}>
                            <PieChart
                                donut
                                radius={65}
                                innerRadius={55}
                                data={pieData}
                                centerLabelComponent={() => {
                                    return <Text style={{ fontSize: 30 }}>70%</Text>;
                                }}
                            />

                        </View>
                    </View>

                    {/* Bottom labels */}
                    <View style={styles.statsRow}>
                        {stats.map(s => (
                            <View key={s.label} style={styles.statBox}>
                                <Text style={styles.statLabel}>{s.label}</Text>
                                <Text style={[styles.statValue, s.color && { color: s.color }]}>{s.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Action rows */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handlePress('tasks')}>
                        <Text style={styles.actionText}>View Tasks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handlePress('members')}>
                        <Text style={styles.actionText}>Manage Members</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handlePress('settings')}>
                        <Text style={styles.actionText}>Team Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 9,
        elevation: 2,
        marginTop: 12,
        gap: 2,
        marginHorizontal: 4,
    },
    overviewLabel: {
        color: '#7a7a7a',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    count: {
        fontSize: 32,
        fontWeight: "700",
        color: "#222",
        marginBottom: 4,
    },
    monthProgress: {
        color: "#7a7a7a",
        fontSize: 14,
        marginBottom: 8,
    },
    chartRow: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    chartBox: {
        alignSelf: 'center',
        width: 120,
        height: 120,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 6,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 13,
        color: '#999',
        marginBottom: 2,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },
    actionRow: {
        backgroundColor: "#fff",
        borderRadius: 14,
        marginHorizontal: 4,
        overflow: 'hidden',
        gap: 2,
        marginBottom: 150
    },
    actionBtn: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f1f1",
    },
    actionText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#222"
    }
});

export default TeamDashboard;
