import { Spinner } from "@/components/ui/spinner";
import { TeamCard } from "@/components/ui/team-card";
import { usePallet } from "@/hooks/use-pallet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllTeams } from "./API/api-calls";

// ...dummyTeams as before

const TeamsListing = ({ open }: { open: () => void }) => {
  const router = useRouter();

  const onAddTeam = () => {
    open();
    // Handle add team
    console.log("Add new team");
  };

  const [Teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const response = await getAllTeams();
      if (response.success) {
        // @ts-ignore
        setTeams(response.data);
      } else {
        setTeams([]);
      }
    } catch (e) {
      console.log(e);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const pallet = usePallet();
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Teams</Text>
        <TouchableOpacity onPress={onAddTeam} style={styles.iconButton}>
          <Ionicons name="add" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner variant="bars" size="default" color={pallet.shade1} />{" "}
        </View>
      ) : (
        <FlatList
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          data={Teams}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TeamCard
              teamName={item.teamName}
              noOfMembers={item?.members?.length}
              noOfTasks={item?.tasks?.length}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    borderBottomColor: "#ddd",
  },
  iconButton: { padding: 6 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  listContent: {
    padding: 12,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: "hidden",
  },
});

export default TeamsListing;
