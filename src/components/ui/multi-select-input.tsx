import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MultiSelectInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelectInput = ({ values, onChange, placeholder }: MultiSelectInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addValue();
    } else if (e.key === "Backspace" && !inputValue && values.length > 0) {
      removeValue(values.length - 1);
    }
  };

  const addValue = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !values.includes(trimmedValue)) {
      onChange([...values, trimmedValue]);
      setInputValue("");
    }
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((value, index) => (
          <Badge key={index} variant="secondary" className="gap-1">
            {value}
            <button
              type="button"
              onClick={() => removeValue(index)}
              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addValue}
        placeholder={placeholder || "Type and press Enter or comma to add"}
      />
    </div>
  );
};
