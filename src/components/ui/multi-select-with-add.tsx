import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectWithAddProps {
  options: Option[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  onAddNew: (name: string) => void;
  placeholder?: string;
  label?: string;
  emptyMessage?: string;
}

export const MultiSelectWithAdd = ({
  options,
  selectedValues,
  onValuesChange,
  onAddNew,
  placeholder = "Select items",
  label,
  emptyMessage = "No items available",
}: MultiSelectWithAddProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const handleAddNew = () => {
    if (newItemName.trim()) {
      onAddNew(newItemName.trim());
      onValuesChange([...selectedValues, newItemName.trim()]);
      setNewItemName("");
      setIsAddingNew(false);
    }
  };

  const removeValue = (value: string) => {
    onValuesChange(selectedValues.filter((v) => v !== value));
  };

  const toggleValue = (value: string, checked: boolean) => {
    if (checked) {
      onValuesChange([...selectedValues, value]);
    } else {
      onValuesChange(selectedValues.filter((v) => v !== value));
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedValues.length > 0 ? (
              <span className="flex gap-1 flex-wrap">
                {selectedValues.slice(0, 2).map((value) => (
                  <Badge key={value} variant="secondary" className="text-xs">
                    {value}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeValue(value);
                      }}
                    />
                  </Badge>
                ))}
                {selectedValues.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedValues.length - 2}
                  </Badge>
                )}
              </span>
            ) : (
              placeholder
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="start">
          <div className="space-y-3">
            {isAddingNew ? (
              <div className="space-y-2">
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
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setIsAddingNew(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
                <div className="border-t pt-2">
                  {options.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      {emptyMessage}
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`option-${option.id}`}
                            checked={selectedValues.includes(option.name)}
                            onCheckedChange={(checked) =>
                              toggleValue(option.name, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`option-${option.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            {option.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
