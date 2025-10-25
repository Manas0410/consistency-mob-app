import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { getTeamMembers } from "@/pages/Team/API/api-calls";
import { AddTeamMember } from "@/pages/Team/components/add-member";
import { useLocalSearchParams } from "expo-router";
import { User } from "lucide-react-native"; // Lucide icon
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const members = [
  { id: "1", userName: "John Doe", mail: "john@example.com" },
  { id: "2", userName: "Jane Smith", mail: "jane@example.com" },
  // Add more members here
];

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { teamid } = useLocalSearchParams();

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const res = await getTeamMembers(teamid);
      if (res.success) {
        setMembers(res.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamid]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <User size={24} color="#333" />
      <Text style={styles.userName}>{item.userName}</Text>
      {/* <Text style={styles.mail}>{item.mail}</Text> */}
    </View>
  );

  const renderAddCard = () => (
    <TouchableOpacity style={styles.addCard} onPress={() => {}}>
      <Text style={styles.addText}>+ Add Member</Text>
    </TouchableOpacity>
  );

  //   alert("Add Member")
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text variant="heading">Team Members </Text>
        <FlatList
          data={members}
          keyExtractor={(item) => item.userId}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={renderAddCard}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
        <AddTeamMember />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "#fff", // Light mode background
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    alignItems: "center",
    width: "auto",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  userName: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 16,
    color: "#222",
  },
  mail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    textAlign: "center",
  },
  addCard: {
    // width: 130,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dotted",
    borderColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  addText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
});
