
import { indiaStates } from "@/utils/indiaData";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IndiaStatesSelectProps {
  onChange: (stateName: string) => void;
  value?: string;
  placeholder?: string;
}

const IndiaStatesSelect = ({ 
  onChange, 
  value, 
  placeholder = "Select a state" 
}: IndiaStatesSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Indian States</SelectLabel>
          {indiaStates.map((state) => (
            <SelectItem key={state.name} value={state.name}>
              {state.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default IndiaStatesSelect;
