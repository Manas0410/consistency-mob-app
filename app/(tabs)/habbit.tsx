import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BackHeader from "@/components/ui/back-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { defaultHabbits } from "@/dummy/defaultHabbits";
import { usePallet } from "@/hooks/use-pallet";
import { ArrowBigRight, Brain, Plus } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Habbit = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Health");
  const pallet = usePallet();
  const [GenerateAIenabled, setGenerateAIEnabled] = useState();

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <BackHeader title="Add Habbits" />
      <Text variant="subtitle" style={{ marginVertical: 20 }}>
        Slect from pre defined categories
      </Text>
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
                <Accordion key={habitName} type="single" collapsible>
                  <AccordionItem value="features">
                    <AccordionTrigger>{habitName}</AccordionTrigger>
                    <AccordionContent style={{ paddingLeft: 8 }}>
                      <Text>{habitDescription}</Text>
                      <Button
                        variant="secondary"
                        style={{
                          alignSelf: "flex-start",
                          marginVertical: 10,
                          height: 30,
                        }}
                        textStyle={{ fontSize: 12 }}
                        icon={Plus}
                      >
                        Add
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </View>
          </TabsContent>
        ))}
      </Tabs>

      <View>
        <Input
          type="textarea"
          variant="outline"
          placeholder="enter your goal"
        />
        <Button
          icon={ArrowBigRight}
          style={{
            backgroundColor: pallet.shade1,
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          GENERATE HABBITS
        </Button>
      </View>
      <Separator style={{ marginVertical: 16 }} />
      <Button
        icon={Brain}
        style={{
          backgroundColor: pallet.shade1,
          borderRadius: 10,
        }}
      >
        GENERATE HABBITS WITH AI
      </Button>
      <Separator style={{ marginVertical: 16 }} />
    </SafeAreaView>
  );
};

export default Habbit;
