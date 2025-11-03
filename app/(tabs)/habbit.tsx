import BackHeader from "@/components/ui/back-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { defaultHabbits } from "@/dummy/defaultHabbits";
import { usePallet } from "@/hooks/use-pallet";
import { createHabbit } from "@/pages/Habbits/API/callAPI";
import HabbitAccordian from "@/pages/Habbits/components/Habbit-accordian";
import { ArrowBigRight, Brain } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Habbit = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Health");
  const pallet = usePallet();
  const [GenerateAIenabled, setGenerateAIEnabled] = useState();
  const [AIGeneratedHabbits, setAIGeneratedHabbits] = useState([]);
  const [AIloading, setAILoading] = useState(false);
  const [HabbitPrompt, setHabbitPrompt] = useState("");

  const getAIHabbits = async () => {
    try {
      setAILoading(true);
      const res = await createHabbit(HabbitPrompt);
      if (res.success) {
        setAIGeneratedHabbits(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setAILoading(false);
    }
  };
  console.log(AIGeneratedHabbits, "qwertyuiop");

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <BackHeader title="Add Habbits" />
      <Text variant="subtitle" style={{ marginVertical: 20 }}>
        Slect from pre defined categories
      </Text>

      {!GenerateAIenabled ? (
        <Tabs
          defaultValue={selectedTab}
          style={{ borderRadius: 10 }}
          onValueChange={(value) => setSelectedTab(value)}
        >
          <TabsList>
            {Object.keys(defaultHabbits).map((key) => (
              <TabsTrigger key={key} value={key} style={{ borderRadius: 30 }}>
                {key}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(defaultHabbits).map(([key, habits]) => (
            <TabsContent key={key} value={key}>
              <View style={{ padding: 16 }}>
                {habits.map(({ habitName, habitDescription }) => (
                  <HabbitAccordian
                    habitName={habitName}
                    habitDescription={habitDescription}
                  />
                ))}
              </View>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <View>
          <Input
            type="textarea"
            variant="outline"
            placeholder="enter your goal"
            value={HabbitPrompt}
            onChangeText={setHabbitPrompt}
          />
          <Button
            icon={ArrowBigRight}
            style={{
              backgroundColor: pallet.shade1,
              borderRadius: 10,
              marginVertical: 10,
            }}
            loading={AIloading}
            onPress={getAIHabbits}
          >
            GENERATE HABBITS
          </Button>
          {AIGeneratedHabbits.length && (
            <View>
              {AIGeneratedHabbits.map(({ habbitName, habbitDescription }) => (
                <HabbitAccordian
                  habitName={habbitName}
                  habitDescription={habbitDescription}
                />
              ))}
            </View>
          )}
        </View>
      )}
      <Separator style={{ marginVertical: 16 }} />
      <Button
        icon={Brain}
        style={{
          backgroundColor: pallet.shade1,
          borderRadius: 10,
        }}
        onPress={() => {
          setGenerateAIEnabled((p) => !p);
        }}
      >
        {GenerateAIenabled ? "SELECT FROM LIST" : "GENERATE HABBITS WITH AI"}
      </Button>
      <Separator style={{ marginVertical: 16 }} />
    </SafeAreaView>
  );
};

export default Habbit;
