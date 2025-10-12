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

export function ComboboxMultiple({ options, value = [], onChange }: { options: OptionType[]; value?: any[]; onChange?: (val: any[]) => void }) {
  const [values, setValues] = useState<any[]>(value);

  const handleValuesChange = (vals: any[]) => {
    setValues(vals);
    if (onChange) onChange(vals);
  };

  return (
    <Combobox multiple values={values} onValuesChange={handleValuesChange}>
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
