import { format } from "date-fns";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
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

const EventCard = ({ event }: EventCardProps) => {
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

  return (
    <Card className="overflow-hidden transition-transform duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 m-4">
          <Badge className={`${categoryColors[event.category] || 'bg-gray-500'} hover:${categoryColors[event.category] || 'bg-gray-600'} text-white font-bold px-3 py-1`}>
            {event.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.name}</h3>
        
        <div className="flex items-center mb-2 text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formatDateRange()}</span>
        </div>
        
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{event.location}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-primary-500 font-bold">${event.price.toFixed(2)}</span>
          <Button className="bg-primary-500 hover:bg-primary-600 text-white">View Event</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
