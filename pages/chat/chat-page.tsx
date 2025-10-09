import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MotivationChat from "./motivation-chat";
import PlannningChat from "./planning-chat";

const ChatPage = () => {
  return (
    <Tabs defaultValue="motivation" style={{ width: 400 }}>
      <TabsList>
        <TabsTrigger value="motivation">Buddy</TabsTrigger>
        <TabsTrigger value="planning">Planning</TabsTrigger>
      </TabsList>

      <TabsContent value="motivation">
        <MotivationChat />
      </TabsContent>

      <TabsContent value="planning">
        <PlannningChat />
      </TabsContent>

      <Input />
    </Tabs>
  );
};
