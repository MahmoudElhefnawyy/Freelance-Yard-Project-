import EventCard from "./EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import type { Event } from "@shared/schema";

interface EventsGridProps {
  events: Event[];
  loading: boolean;
}

const EventsGrid = ({ events, loading }: EventsGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"date" | "price" | "name">("date");
  
  // Sort events based on the selected order
  const sortedEvents = [...events].sort((a, b) => {
    switch (sortOrder) {
      case "date":
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case "price":
        return a.price - b.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
  
  // If loading, show skeleton cards
  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center">
            <Skeleton className="h-10 w-20 mr-2" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="col-span-1 sm:col-span-2 lg:col-span-3 py-16 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          We couldn't find any events matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex items-center">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{events.length}</span> events found
          </p>
          <div className="ml-4 flex items-center">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            <select 
              className="text-sm border rounded-md p-1" 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
            >
              <option value="date">Date</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>
            <ArrowUpDown className="h-4 w-4 ml-1 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">View:</span>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-primary-500 text-white" : "text-gray-500"}
            title="Grid view"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary-500 text-white" : "text-gray-500"}
            title="List view"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid grid-cols-1 gap-4"
      }>
        {sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
};

export default EventsGrid;
