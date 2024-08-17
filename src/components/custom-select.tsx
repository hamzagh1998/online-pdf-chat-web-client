import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizer, cn } from "@/lib/utils";

type SelectProps = {
  className?: string;
  placeholder?: string;
  isCapitazed?: boolean;
  selectedLabel?: string;
  options: string[];
  setValue: (value: string) => void;
};

export function CustomSelect({
  className,
  isCapitazed = true,
  selectedLabel,
  placeholder,
  options,
  setValue,
}: SelectProps) {
  return (
    <Select onValueChange={setValue}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectedLabel && <SelectLabel>{selectedLabel}</SelectLabel>}
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {isCapitazed ? capitalizer(option) : option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
