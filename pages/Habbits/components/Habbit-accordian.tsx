import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { Plus } from "lucide-react-native";

const HabbitAccordian = ({ habitName, habitDescription, addAccordian }) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        marginVertical: 4,
        padding: 8,
        borderRadius: 10,
      }}
    >
      <Accordion key={habitName} type="single">
        <AccordionItem value="features">
          <AccordionTrigger style={{ paddingHorizontal: 10 }}>
            {habitName}
          </AccordionTrigger>
          <AccordionContent style={{ paddingHorizontal: 10 }}>
            <Text style={{ marginLeft: 10 }}>{habitDescription}</Text>
            <Button
              variant="secondary"
              style={{
                alignSelf: "flex-start",
                marginTop: 14,
                height: 30,
                marginLeft: 10,
                backgroundColor: "#e6f1ffff",
              }}
              textStyle={{ color: "#3B82F6", fontSize: 12 }}
              icon={Plus}
              onPress={() => addAccordian(habitName, habitDescription)}
            >
              Add
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
};

export default HabbitAccordian;
