import type { ReactNode } from "react";

export interface CustomInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  children?: ReactNode;
}
