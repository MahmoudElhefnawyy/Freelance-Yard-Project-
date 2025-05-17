import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import EventsGrid from "@/components/EventsGrid";
import Footer from "@/components/Footer";
import { getMockEvents } from "@/lib/utils/mockEvents";
import { formatCurrency } from "@/lib/utils/formatters";
import { getEvents, buildSearchParams } from "@/lib/utils/apiService";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, DatabaseIcon } from "lucide-react";
import type { Event } from "@shared/schema";

const Events = () => {
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [isUsingMockData, setIsUsingMockData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;
  
  // Query for fetching events from the API
  const { data: apiEvents, isLoading, error, refetch } = useQuery({
    queryKey: [
      `/api/events`, 
      searchTerm, 
      dateFilter, 
      locationFilter, 
      categoryFilter, 
      priceRange.join('-')
    ],
    queryFn: async () => {
      // If using mock data, throw to use local filtering
      if (isUsingMockData) {
        throw new Error("Using mock data");
      }
      
      // Use the apiService to fetch events with filters
      const params = buildSearchParams(
        searchTerm,
        dateFilter,
        locationFilter,
        categoryFilter,
        priceRange
      );
      
      return getEvents(params);
    },
    retry: 1,
    staleTime: 60000, // 1 minute
  });
  
  // Get and filter events
  const [events, setEvents] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  
  // Filter and paginate events
  useEffect(() => {
    if (isUsingMockData || error) {
      const mockEvents = getMockEvents();
      
      // Apply filters on the client side to mock API behavior
      const filtered = mockEvents.filter(event => {
        // Search term filter
        const searchMatches = !searchTerm || 
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Date filter
        let dateMatches = true;
        if (dateFilter && dateFilter !== 'all') {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const eventDate = new Date(event.startDate);
          
          switch (dateFilter) {
            case 'today':
              dateMatches = 
                eventDate.getDate() === today.getDate() && 
                eventDate.getMonth() === today.getMonth() && 
                eventDate.getFullYear() === today.getFullYear();
              break;
            case 'tomorrow':
              dateMatches = 
                eventDate.getDate() === tomorrow.getDate() && 
                eventDate.getMonth() === tomorrow.getMonth() && 
                eventDate.getFullYear() === tomorrow.getFullYear();
              break;
            case 'weekend':
              const day = eventDate.getDay();
              const isSaturday = day === 6;
              const isSunday = day === 0;
              const isThisWeekend = 
                eventDate >= today && 
                eventDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) && 
                (isSaturday || isSunday);
              dateMatches = isThisWeekend;
              break;
            case 'week':
              const nextWeek = new Date(today);
              nextWeek.setDate(today.getDate() + 7);
              dateMatches = eventDate >= today && eventDate <= nextWeek;
              break;
            case 'month':
              const nextMonth = new Date(today);
              nextMonth.setMonth(today.getMonth() + 1);
              dateMatches = eventDate >= today && eventDate <= nextMonth;
              break;
          }
        }
        
        // Location filter
        const locationMatches = !locationFilter || 
          locationFilter === 'all' || 
          event.location.toLowerCase().includes(locationFilter.toLowerCase());
        
        // Category filter
        const categoryMatches = !categoryFilter || 
          categoryFilter === 'all' || 
          event.category === categoryFilter;
        
        // Price range filter
        const priceMatches = 
          event.price >= priceRange[0] && 
          event.price <= priceRange[1];
        
        return searchMatches && dateMatches && locationMatches && categoryMatches && priceMatches;
      });
      
      setFilteredEvents(filtered);
      setTotalEvents(filtered.length);
      
      // Paginate
      const startIndex = (currentPage - 1) * eventsPerPage;
      const endIndex = startIndex + eventsPerPage;
      setEvents(filtered.slice(startIndex, endIndex));
    } else if (apiEvents) {
      setFilteredEvents(apiEvents);
      setTotalEvents(apiEvents.length);
      
      // Paginate
      const startIndex = (currentPage - 1) * eventsPerPage;
      const endIndex = startIndex + eventsPerPage;
      setEvents(apiEvents.slice(startIndex, endIndex));
    }
  }, [
    isUsingMockData, 
    apiEvents, 
    error, 
    searchTerm, 
    dateFilter, 
    locationFilter, 
    categoryFilter, 
    priceRange,
    currentPage
  ]);
  
  // Calculate total pages
  const totalPages = Math.ceil(totalEvents / eventsPerPage);
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first and last page
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, current page, and pages around current
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push(null); // Ellipsis
      }
      
      // Pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push(null); // Ellipsis
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Handle filter changes
  const handleFilterChange = (
    search: string, 
    date: string, 
    location: string, 
    category: string = "all", 
    price: [number, number] = [0, 500]
  ) => {
    // Reset to first page when filters change
    setCurrentPage(1);
    
    setSearchTerm(search);
    setDateFilter(date);
    setLocationFilter(location);
    setCategoryFilter(category);
    setPriceRange(price);
  };
  
  // Toggle between mock data and API data
  const toggleDataSource = () => {
    setIsUsingMockData(!isUsingMockData);
    setCurrentPage(1);
    
    // Refetch data if switching to API
    if (isUsingMockData) {
      setTimeout(() => refetch(), 100);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header activeLink="events" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Find Events
            </h1>
            <p className="mt-2 text-gray-600">Discover amazing events happening around you</p>
          </div>
          
          {/* Data Source Toggle */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center">
              <Badge variant={isUsingMockData ? "outline" : "default"} className="mr-2">
                {isUsingMockData ? "Mock Data" : "API Data"}
              </Badge>
              {!isUsingMockData && !error && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Connected to JSONPlaceholder
                </Badge>
              )}
              {!isUsingMockData && isLoading && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse ml-2">
                  Loading...
                </Badge>
              )}
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={toggleDataSource}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <DatabaseIcon className="h-4 w-4" />
              <span>
                {isUsingMockData ? "Switch to API data" : "Switch to mock data"}
              </span>
            </Button>
          </div>
          
          {/* API Error Alert */}
          {!isUsingMockData && error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Couldn't connect to the API. Using mock data instead.
                {error instanceof Error && <span className="block text-xs mt-1">{error.message}</span>}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Filter Bar */}
          <FilterBar 
            onFilterChange={handleFilterChange}
            searchTerm={searchTerm}
            dateFilter={dateFilter}
            locationFilter={locationFilter}
            categoryFilter={categoryFilter}
            priceRange={priceRange}
          />
          
          {/* Events Count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{events.length}</span> of <span className="font-medium">{totalEvents}</span> events
            </p>
          </div>
          
          {/* Events Grid */}
          <EventsGrid events={events} loading={isLoading} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* Previous Page */}
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) => (
                    page === null ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`page-${page}`}>
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  ))}
                  
                  {/* Next Page */}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          {/* API Integration Information */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">API Integration Information</h3>
            <p className="mb-4">
              This application is built to work with both mock data and a real API. 
              Currently, it's {isUsingMockData ? "using mock data" : "connected to the JSONPlaceholder fake REST API"}.
            </p>
            
            <h4 className="font-medium mb-2">About the API Integration:</h4>
            <ul className="list-disc ml-5 space-y-2 text-sm">
              <li>This demo uses <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">JSONPlaceholder</a> as a fake REST API service</li>
              <li>The application transforms the data from JSONPlaceholder into our Events format</li>
              <li>Click the "Using mock data" button at the top of the page to toggle between mock and API data</li>
              <li>When using the API, the application applies filters client-side since JSONPlaceholder has limited filtering capabilities</li>
              <li>In a production environment, you would replace this with your actual API endpoints</li>
            </ul>
            
            <div className="mt-4 p-3 bg-primary-50 rounded border border-primary-200 text-sm">
              <p className="font-medium mb-1">API Implementation Details:</p>
              <p>The API integration demonstrates how to transform external data to match your application's data model. This is useful when working with third-party APIs that don't exactly match your data structure.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
