import { CardWithImage } from "@/components/demo/card/card-with-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyTeams = [
    {
        id: "1",
        teamName: "Sex Sux",
        teamDesc: "Design team for product UI/UX and visuals",
        imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "2",
        teamName: "Marketing Campaign",
        teamDesc: "Campaign team for product launches",
        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "3",
        teamName: "Software Development",
        teamDesc: "Dev team for product apps and services",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "4",
        teamName: "Operations",
        teamDesc: "Backoffice and logistics",
        imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
    }
];

// ...dummyTeams as before

const TeamsListing = ({open}:{open:()=>void}) => {
  const router = useRouter();

  const onAddTeam = () => {
    open()
    // Handle add team
    console.log("Add new team");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Teams</Text>
        <TouchableOpacity onPress={onAddTeam} style={styles.iconButton}>
          <Ionicons name="add" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Only use FlatList for vertical scroll */}
      <FlatList
        data={dummyTeams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardWithImage
            title={item.teamName}
            description={item.teamDesc}
            imageUrl={item.imageUrl}
            onClick={() => {}}
            style={styles.card}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f8fa" },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  iconButton: { padding: 6 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111"
  },
  listContent: {
    padding: 12,
    paddingBottom: 32
  },
  card: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: "hidden"
  }
});



export default TeamsListing;
