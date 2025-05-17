import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (search: string, date: string, location: string) => void;
  searchTerm: string;
  dateFilter: string;
  locationFilter: string;
}

const FilterBar = ({ onFilterChange, searchTerm, dateFilter, locationFilter }: FilterBarProps) => {
  const [search, setSearch] = useState(searchTerm);
  const [date, setDate] = useState(dateFilter);
  const [location, setLocation] = useState(locationFilter);
  
  // When the internal state changes, notify the parent component
  useEffect(() => {
    onFilterChange(search, date, location);
  }, [search, date, location, onFilterChange]);
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setDate("all");
    setLocation("all");
  };
  
  // Build active filters array for display
  const activeFilters = [];
  if (search) activeFilters.push(`Search: "${search}"`);
  if (date && date !== 'all') {
    const dateText = {
      'today': 'Today',
      'weekend': 'This weekend',
      'week': 'This week',
      'month': 'This month'
    }[date] || date;
    
    activeFilters.push(`Date: ${dateText}`);
  }
  if (location && location !== 'all') activeFilters.push(`Location: ${location}`);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Search Input */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Events
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event name, artist, etc."
              className="pl-10"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="col-span-1">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <Select value={date} onValueChange={setDate}>
            <SelectTrigger id="date">
              <SelectValue placeholder="Any date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="weekend">This weekend</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Dropdown */}
        <div className="col-span-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              <SelectItem value="Chicago">Chicago</SelectItem>
              <SelectItem value="Miami">Miami</SelectItem>
              <SelectItem value="Austin">Austin</SelectItem>
              <SelectItem value="Seattle">Seattle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
          Active Filters:
        </span>
        <span className="text-sm text-gray-500">
          {activeFilters.length > 0 ? activeFilters.join(' • ') : 'None'}
        </span>
        {activeFilters.length > 0 && (
          <button 
            onClick={handleResetFilters}
            className="ml-2 text-sm text-primary-500 hover:text-primary-700 font-medium"
          >
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
