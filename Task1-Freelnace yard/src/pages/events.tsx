import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import EventsGrid from "@/components/EventsGrid";
import Footer from "@/components/Footer";
import { getMockEvents } from "@/lib/utils/mockEvents";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";
import type { Event } from "@shared/schema";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [isUsingMockData, setIsUsingMockData] = useState(true);
  
  // Query for fetching events from the API
  const { data: apiEvents, isLoading, error } = useQuery({
    queryKey: [`/api/events`, searchTerm, dateFilter, locationFilter],
    queryFn: async () => {
      // If not using API yet, throw to use mock data
      if (isUsingMockData) {
        throw new Error("Using mock data");
      }
      
      // Build query params
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (dateFilter) params.append("date", dateFilter);
      if (locationFilter) params.append("location", locationFilter);
      
      return fetch(`/api/events?${params.toString()}`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      });
    },
    retry: false,
  });
  
  // Get mock events when not using API
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    if (isUsingMockData || error) {
      const mockEvents = getMockEvents();
      
      // Apply filters on the client side to mock API behavior
      const filteredEvents = mockEvents.filter(event => {
        const searchMatches = !searchTerm || 
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        let dateMatches = true;
        if (dateFilter && dateFilter !== 'all') {
          const today = new Date();
          const eventDate = new Date(event.startDate);
          
          switch (dateFilter) {
            case 'today':
              dateMatches = 
                eventDate.getDate() === today.getDate() && 
                eventDate.getMonth() === today.getMonth() && 
                eventDate.getFullYear() === today.getFullYear();
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
        
        const locationMatches = !locationFilter || 
          locationFilter === 'all' || 
          event.location.toLowerCase().includes(locationFilter.toLowerCase());
        
        return searchMatches && dateMatches && locationMatches;
      });
      
      setEvents(filteredEvents);
    } else if (apiEvents) {
      setEvents(apiEvents);
    }
  }, [isUsingMockData, apiEvents, error, searchTerm, dateFilter, locationFilter]);
  
  const handleFilterChange = (search: string, date: string, location: string) => {
    setSearchTerm(search);
    setDateFilter(date);
    setLocationFilter(location);
  };
  
  // Toggle between mock data and API data
  const toggleDataSource = () => {
    setIsUsingMockData(!isUsingMockData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header activeLink="events" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Events</h1>
            <p className="mt-2 text-gray-600">Discover amazing events happening around you</p>
          </div>
          
          <FilterBar 
            onFilterChange={handleFilterChange}
            searchTerm={searchTerm}
            dateFilter={dateFilter}
            locationFilter={locationFilter}
          />
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{events.length}</span> events
            </p>
            <div className="flex items-center">
              <button 
                onClick={toggleDataSource}
                className="text-sm text-primary-500 hover:text-primary-700 transition"
              >
                {isUsingMockData ? "Using mock data - Click to use API" : "Using API - Click to use mock data"}
              </button>
            </div>
          </div>
          
          <EventsGrid events={events} loading={isLoading} />
          
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" aria-label="Previous page">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" aria-current="page" className="bg-primary-50 border-primary-500 text-primary-600">
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="hidden md:inline-flex">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="hidden md:inline-flex">
                    8
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    9
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    10
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" aria-label="Next page">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
