
import { useState, useEffect } from "react";
import { Location } from "@/types";
import { searchCitiesByName } from "@/utils/tomtomUtils";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitiesSelectProps {
  onChange: (location: Location) => void;
  placeholder?: string;
  state?: string;
  value?: Location;
}

const CitiesSelect = ({
  onChange,
  placeholder = "Search for a city...",
  state,
  value
}: CitiesSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const searchCities = async () => {
      if (searchQuery.length < 2) {
        setCities([]);
        return;
      }
      
      setLoading(true);
      try {
        let query = searchQuery;
        if (state) {
          query = `${searchQuery}, ${state}`;
        }
        
        const results = await searchCitiesByName(query);
        console.log("City search results:", results);
        setCities(results);
      } catch (error) {
        console.error("Error searching cities:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(searchCities, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, state]);
  
  const displayValue = value ? (value.name || "Select location") : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search cities..." 
            className="h-9" 
            value={searchQuery} 
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {loading && (
              <div className="py-6 text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Searching cities...</p>
              </div>
            )}
            <CommandEmpty>{searchQuery.length < 2 ? "Type at least 2 characters" : "No cities found"}</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={`${city.lat}-${city.lng}`}
                  value={city.name}
                  onSelect={() => {
                    onChange(city);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <span>{city.name || "Unknown Location"}</span>
                    {city.address && city.address !== city.name && (
                      <p className="text-xs text-muted-foreground">{city.address}</p>
                    )}
                  </div>
                  {value && value.lat === city.lat && value.lng === city.lng && (
                    <Check className="h-4 w-4 ml-2" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitiesSelect;
