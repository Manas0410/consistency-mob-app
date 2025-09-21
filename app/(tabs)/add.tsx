import AddForm from "@/pages/add/add-form";
import { SafeAreaView } from "react-native-safe-area-context";

const AddScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AddForm />
    </SafeAreaView>
  );
};

export default AddScreen;
