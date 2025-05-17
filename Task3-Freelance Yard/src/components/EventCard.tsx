import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, TagIcon, ArrowRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/formatters";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  viewMode?: "grid" | "list";
}

// Define colors for different categories
const categoryColors: Record<string, string> = {
  MUSIC: "bg-secondary-500",
  CONFERENCE: "bg-amber-500",
  FOOD: "bg-green-500",
  SPORTS: "bg-blue-500",
  ARTS: "bg-purple-500",
  COMEDY: "bg-yellow-500",
  FILM: "bg-red-500",
  OTHER: "bg-gray-500",
};

// Create a hover effect for all categories
const categoryHoverColors: Record<string, string> = {
  MUSIC: "hover:bg-secondary-600",
  CONFERENCE: "hover:bg-amber-600",
  FOOD: "hover:bg-green-600",
  SPORTS: "hover:bg-blue-600",
  ARTS: "hover:bg-purple-600",
  COMEDY: "hover:bg-yellow-600",
  FILM: "hover:bg-red-600",
  OTHER: "hover:bg-gray-600",
};

const EventCard = ({ event, viewMode = "grid" }: EventCardProps) => {
  // Format the date range
  const formatDateRange = () => {
    const startDate = new Date(event.startDate);
    
    if (event.endDate) {
      const endDate = new Date(event.endDate);
      
      // Same day event
      if (
        startDate.getDate() === endDate.getDate() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear()
      ) {
        return format(startDate, "MMMM d, yyyy");
      }
      
      // Same month event
      if (
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear()
      ) {
        return `${format(startDate, "MMMM d")}-${format(endDate, "d, yyyy")}`;
      }
      
      // Different months
      return `${format(startDate, "MMMM d")}-${format(endDate, "MMMM d, yyyy")}`;
    }
    
    // Single day event
    return format(startDate, "MMMM d, yyyy");
  };

  // Format the time
  const formatTime = () => {
    const startDate = new Date(event.startDate);
    return format(startDate, "h:mm a");
  };

  // Check if the event is today
  const isToday = () => {
    const today = new Date();
    const eventDate = new Date(event.startDate);
    return (
      today.getDate() === eventDate.getDate() &&
      today.getMonth() === eventDate.getMonth() &&
      today.getFullYear() === eventDate.getFullYear()
    );
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-primary-500">
        <div className="flex flex-col md:flex-row w-full">
          <div className="md:w-1/4 w-full h-48 md:h-auto relative">
            <img 
              src={event.imageUrl} 
              alt={event.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 m-2">
              <Badge 
                className={`${categoryColors[event.category] || 'bg-gray-500'} ${categoryHoverColors[event.category] || 'hover:bg-gray-600'} text-white font-bold px-3 py-1`}
              >
                {event.category}
              </Badge>
              {isToday() && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 ml-2">
                  TODAY
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-4 md:p-6 flex-1">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{formatDateRange()}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTime()}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 md:pr-8">{event.description}</p>
              </div>
              
              <div className="flex flex-col justify-between mt-4 md:mt-0">
                <div className="text-right">
                  <span className="text-xl text-primary-500 font-bold block">
                    {formatCurrency(event.price)}
                  </span>
                  <span className="text-xs text-gray-500">per person</span>
                </div>
                <div className="mt-auto pt-4">
                  <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                    View Details
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 m-3">
          <Badge 
            className={`${categoryColors[event.category] || 'bg-gray-500'} ${categoryHoverColors[event.category] || 'hover:bg-gray-600'} text-white font-bold px-3 py-1`}
          >
            {event.category}
          </Badge>
        </div>
        {isToday() && (
          <div className="absolute top-0 right-0 m-3">
            <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1">
              TODAY
            </Badge>
          </div>
        )}
        <div className="absolute bottom-0 right-0 m-3">
          <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-md font-bold">
            {formatCurrency(event.price)}
          </span>
        </div>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{event.name}</h3>
        
        <div className="flex items-center mb-2 text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 min-w-4 mr-1" />
          <span className="truncate">{formatDateRange()}</span>
        </div>
        
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4 min-w-4 mr-1" />
          <span className="truncate">{event.location}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{event.description}</p>
        
        <Button className="w-full mt-auto bg-primary-500 hover:bg-primary-600 text-white">
          View Event
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
