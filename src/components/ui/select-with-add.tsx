import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Option {
  id: string;
  name: string;
}

interface SelectWithAddProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  onAddNew: (name: string) => void;
  placeholder?: string;
  label?: string;
  emptyMessage?: string;
}

export const SelectWithAdd = ({
  options,
  value,
  onValueChange,
  onAddNew,
  placeholder = "Select item",
  label,
  emptyMessage = "No items available",
}: SelectWithAddProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const handleAddNew = () => {
    if (newItemName.trim()) {
      onAddNew(newItemName.trim());
      onValueChange(newItemName.trim());
      setNewItemName("");
      setIsAddingNew(false);
    }
  };

  if (isAddingNew) {
    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <Input
          placeholder="Enter name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddNew();
            }
          }}
          autoFocus
        />
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={handleAddNew}>
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAddingNew(false);
              setNewItemName("");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select
        value={value}
        onValueChange={(val) => {
          if (val === "__create_new__") {
            setIsAddingNew(true);
          } else {
            onValueChange(val);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__create_new__">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </div>
          </SelectItem>
          {options.length === 0 ? (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">
              {emptyMessage}
            </div>
          ) : (
            options.map((option) => (
              <SelectItem key={option.id} value={option.name}>
                {option.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
