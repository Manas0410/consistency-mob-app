import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  OptionType,
} from "@/components/ui/combobox";
import React, { useState } from "react";

export function ComboboxMultiple({ options }: { options: OptionType[] }) {
  const [values, setValues] = useState<OptionType[]>([]);

  return (
    <Combobox multiple values={values} onValuesChange={setValues}>
      <ComboboxTrigger>
        <ComboboxValue placeholder="Frequency" />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="" />
        <ComboboxList>
          <ComboboxEmpty>No skill found.</ComboboxEmpty>
          {options.map((skill) => (
            <ComboboxItem key={skill.value} value={skill.value}>
              {skill.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
