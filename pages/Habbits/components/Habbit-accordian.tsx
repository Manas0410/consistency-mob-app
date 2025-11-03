import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Plus } from "lucide-react-native";

const HabbitAccordian = ({ habitName, habitDescription, addAccordian }) => {
  return (
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
            onPress={() => addAccordian(habitName, habitDescription)}
          >
            Add
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default HabbitAccordian;
