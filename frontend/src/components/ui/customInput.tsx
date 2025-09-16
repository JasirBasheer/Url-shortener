import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CustomInputProps } from "@/types";

const CustomInput: React.FC<CustomInputProps> = React.memo(
  ({ id, label, type = "text", placeholder, value, onChange, children }) => (
    <div className="grid gap-3">
      <div className="flex items-center">
        <Label htmlFor={id}>{label}</Label>
        {children}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  )
);

export default CustomInput;
