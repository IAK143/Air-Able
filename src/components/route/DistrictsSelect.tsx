
import { useEffect, useState } from "react";
import { getStateByName } from "@/utils/indiaData";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DistrictsSelectProps {
  stateName: string | undefined;
  onChange: (districtName: string) => void;
  value?: string;
  placeholder?: string;
}

const DistrictsSelect = ({ 
  stateName, 
  onChange,
  value,
  placeholder = "Select a district" 
}: DistrictsSelectProps) => {
  const [districts, setDistricts] = useState<{ name: string; lat: number; lng: number; }[]>([]);

  useEffect(() => {
    if (stateName) {
      const state = getStateByName(stateName);
      if (state) {
        setDistricts(state.districts);
      } else {
        setDistricts([]);
      }
    } else {
      setDistricts([]);
    }
  }, [stateName]);

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={districts.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Districts in {stateName || 'Selected State'}</SelectLabel>
          {districts.map((district) => (
            <SelectItem key={district.name} value={district.name}>
              {district.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DistrictsSelect;
