import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { CardWithImage } from "@/components/demo/card/card-with-image";

type Team = {
  id: string;
  teamName: string;
  teamDesc: string;
  imageUrl: string;
};

const dummyTeams: Team[] = [
  {
    id: "1",
    teamName: "Product Design",
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

const TeamsListing: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyTeams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardWithImage
            title={item.teamName}
            description={item.teamDesc}
            imageUrl={item.imageUrl}
            onClick={() => {
              // Handle click, e.g., open details
            }}
            style={styles.card}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    padding: 12
  },
  listContent: {
    paddingBottom: 32
  },
  card: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: "hidden"
  }
});

export default TeamsListing;
