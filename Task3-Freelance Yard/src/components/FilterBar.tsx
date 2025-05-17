import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  Calendar, 
  MapPin, 
  Tag, 
  X, 
  Sliders, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { EventCategory } from "@shared/schema";

// Define a simple formatCurrency function right here
const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface FilterBarProps {
  onFilterChange: (
    search: string, 
    date: string, 
    location: string, 
    category?: string, 
    priceRange?: [number, number]
  ) => void;
  searchTerm: string;
  dateFilter: string;
  locationFilter: string;
  categoryFilter?: string;
  priceRange?: [number, number];
}

const FilterBar = ({ 
  onFilterChange, 
  searchTerm, 
  dateFilter, 
  locationFilter, 
  categoryFilter = "all",
  priceRange = [0, 500]
}: FilterBarProps) => {
  const [search, setSearch] = useState(searchTerm);
  const [date, setDate] = useState(dateFilter);
  const [location, setLocation] = useState(locationFilter);
  const [category, setCategory] = useState(categoryFilter);
  const [price, setPrice] = useState<[number, number]>(priceRange);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // For search debouncing
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout to update the filter after typing stops
    searchTimeoutRef.current = setTimeout(() => {
      onFilterChange(value, date, location, category, price);
    }, 300); // 300ms debounce
  };
  
  // When dropdown filters change, update immediately
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onFilterChange(search, date, location, category, price);
  }, [date, location, category, price, onFilterChange]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setDate("all");
    setLocation("all");
    setCategory("all");
    setPrice([0, 500]);
    onFilterChange("", "all", "all", "all", [0, 500]);
  };
  
  // Build active filters array for display
  const activeFilters = [];
  if (search) activeFilters.push({ type: 'search', label: `"${search}"`, value: search });
  if (date && date !== 'all') {
    const dateText = {
      'today': 'Today',
      'tomorrow': 'Tomorrow',
      'weekend': 'This weekend',
      'week': 'This week',
      'month': 'This month',
      'custom': 'Custom date range'
    }[date] || date;
    
    activeFilters.push({ type: 'date', label: dateText, value: date });
  }
  if (location && location !== 'all') {
    activeFilters.push({ type: 'location', label: location, value: location });
  }
  if (category && category !== 'all') {
    activeFilters.push({ type: 'category', label: category, value: category });
  }
  if (price[0] > 0 || price[1] < 500) {
    activeFilters.push({ 
      type: 'price', 
      label: `${formatCurrency(price[0])} - ${formatCurrency(price[1])}`,
      value: `${price[0]}-${price[1]}`
    });
  }
  
  // Remove a specific filter
  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case 'search':
        setSearch("");
        break;
      case 'date':
        setDate("all");
        break;
      case 'location':
        setLocation("all");
        break;
      case 'category':
        setCategory("all");
        break;
      case 'price':
        setPrice([0, 500]);
        break;
    }
    
    // Update parent with new filters
    onFilterChange(
      type === 'search' ? "" : search,
      type === 'date' ? "all" : date,
      type === 'location' ? "all" : location,
      type === 'category' ? "all" : category,
      type === 'price' ? [0, 500] : price
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Search Input */}
        <div className="col-span-1 md:col-span-5">
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
              onChange={handleSearchChange}
              placeholder="Search by event name, artist, description..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="col-span-1 md:col-span-3">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </div>
          </label>
          <Select value={date} onValueChange={setDate}>
            <SelectTrigger id="date">
              <SelectValue placeholder="Any date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any date</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="weekend">This weekend</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Dropdown */}
        <div className="col-span-1 md:col-span-3">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
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
              <SelectItem value="San Francisco">San Francisco</SelectItem>
              <SelectItem value="Boston">Boston</SelectItem>
              <SelectItem value="Denver">Denver</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Advanced Filters Toggle */}
        <div className="col-span-1 md:col-span-1 flex items-end">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Sliders className="h-4 w-4 mr-1" />
            {showAdvancedFilters ? 
              <ChevronUp className="h-4 w-4 ml-1" /> : 
              <ChevronDown className="h-4 w-4 ml-1" />
            }
          </Button>
        </div>
      </div>
      
      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>Event Category</span>
              </div>
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value={EventCategory.MUSIC}>{EventCategory.MUSIC}</SelectItem>
                <SelectItem value={EventCategory.CONFERENCE}>{EventCategory.CONFERENCE}</SelectItem>
                <SelectItem value={EventCategory.FOOD}>{EventCategory.FOOD}</SelectItem>
                <SelectItem value={EventCategory.SPORTS}>{EventCategory.SPORTS}</SelectItem>
                <SelectItem value={EventCategory.ARTS}>{EventCategory.ARTS}</SelectItem>
                <SelectItem value={EventCategory.COMEDY}>{EventCategory.COMEDY}</SelectItem>
                <SelectItem value={EventCategory.FILM}>{EventCategory.FILM}</SelectItem>
                <SelectItem value={EventCategory.OTHER}>{EventCategory.OTHER}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <div className="flex items-center gap-1 mb-1">
                <span>Price Range</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatCurrency(price[0])}</span>
                <span>{formatCurrency(price[1])}</span>
              </div>
            </label>
            <Slider
              value={price}
              min={0}
              max={500}
              step={5}
              minStepsBetweenThumbs={1}
              onValueChange={(value) => setPrice(value as [number, number])}
              className="mt-2"
            />
          </div>
        </div>
      )}
      
      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        {activeFilters.length > 0 ? (
          <>
            <span className="text-sm text-gray-700 font-medium mr-2">
              Active Filters:
            </span>
            {activeFilters.map((filter, index) => (
              <Badge 
                key={`${filter.type}-${index}`}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                <span>{filter.label}</span>
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => removeFilter(filter.type, filter.value)}
                />
              </Badge>
            ))}
            <Button 
              onClick={handleResetFilters}
              variant="ghost"
              size="sm"
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          </>
        ) : (
          <span className="text-sm text-gray-500">No active filters</span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
