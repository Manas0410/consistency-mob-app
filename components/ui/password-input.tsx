import { Input, InputProps } from "@/components/ui/input";
import { useColor } from "@/hooks/useColor";
import { Eye, EyeOff } from "lucide-react-native";
import React, { forwardRef, useState } from "react";
import { Pressable, TextInput } from "react-native";

export interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry' | 'rightComponent'> {
  showPasswordByDefault?: boolean;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  ({ showPasswordByDefault = false, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(showPasswordByDefault);
    const textColor = useColor({}, "text");
    const mutedColor = useColor({}, "textMuted");

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const EyeIcon = isPasswordVisible ? EyeOff : Eye;

    return (
      <Input
        {...props}
        ref={ref}
        secureTextEntry={!isPasswordVisible}
        rightComponent={
          <Pressable
            onPress={togglePasswordVisibility}
            style={{
              padding: 4,
              marginLeft: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <EyeIcon 
              size={20} 
              color={mutedColor}
              strokeWidth={1.5}
            />
          </Pressable>
        }
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
