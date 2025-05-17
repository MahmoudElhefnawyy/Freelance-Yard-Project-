import { Event, EventCategory } from "@shared/schema";

/**
 * API Service for Events
 * This service provides functions to interact with the events API
 * 
 * We're using JSONPlaceholder as a fake REST API for testing purposes
 * https://jsonplaceholder.typicode.com
 */

// Using JSONPlaceholder for fake API data
const FAKE_API_URL = 'https://jsonplaceholder.typicode.com';
const API_URL = '/api/events';

/**
 * Get all events from API
 * @param params Optional query parameters
 * @returns Promise with events
 */
export const getEvents = async (params?: Record<string, string>): Promise<Event[]> => {
  try {
    // For the fake API integration, we'll use JSONPlaceholder's posts endpoint
    // and transform the data to match our Event type
    let url = `${FAKE_API_URL}/posts`;
    
    // Add query params if provided (note: JSONPlaceholder supports limited filtering)
    if (params && Object.keys(params).length > 0) {
      // JSONPlaceholder supports _limit parameter
      const limit = params.maxResults || '20';
      url += `?_limit=${limit}`;
    }
    
    console.log('Fetching events from JSONPlaceholder API:', url);
    
    // Add artificial delay to simulate real-world API latency (remove in production)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    // Get the raw posts data from JSONPlaceholder
    const postsData = await response.json();
    
    // Transform JSONPlaceholder posts into our Event format
    const events: Event[] = postsData.map((post: any, index: number) => {
      // Create a date between now and 30 days in the future
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30));
      
      // Generate random price between $10 and $500
      const price = Math.floor(Math.random() * 490) + 10;
      
      // Get a random category
      const categories = Object.values(EventCategory);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // Generate random location
      const locations = [
        "New York, NY", 
        "Los Angeles, CA", 
        "Chicago, IL", 
        "Miami, FL", 
        "Austin, TX", 
        "San Francisco, CA", 
        "Seattle, WA",
        "Denver, CO",
        "Boston, MA",
        "Nashville, TN"
      ];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      // Apply any text search filtering from params
      if (params?.search && 
          !post.title.toLowerCase().includes(params.search.toLowerCase()) && 
          !post.body.toLowerCase().includes(params.search.toLowerCase())) {
        return null;
      }
      
      // Apply any location filtering from params
      if (params?.location && params.location !== 'all' && 
          !randomLocation.toLowerCase().includes(params.location.toLowerCase())) {
        return null;
      }
      
      // Apply any category filtering from params
      if (params?.category && params.category !== 'all' && 
          randomCategory !== params.category) {
        return null;
      }
      
      // Apply price filtering
      const minPrice = params?.minPrice ? parseInt(params.minPrice) : 0;
      const maxPrice = params?.maxPrice ? parseInt(params.maxPrice) : 500;
      
      if (price < minPrice || price > maxPrice) {
        return null;
      }
      
      return {
        id: post.id,
        name: post.title,
        description: post.body,
        startDate: futureDate,
        endDate: new Date(futureDate.getTime() + (3 * 60 * 60 * 1000)), // 3 hours later
        location: randomLocation,
        price: price,
        category: randomCategory,
        imageUrl: `https://picsum.photos/seed/${post.id}/600/400`, // Random image from picsum
        createdAt: now
      };
    }).filter(Boolean) as Event[]; // Filter out null values
    
    // Additional filtering for date if needed
    if (params?.date && params.date !== 'all') {
      const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.startDate);
        const today = new Date();
        
        switch(params.date) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'tomorrow':
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            return eventDate.toDateString() === tomorrow.toDateString();
          case 'weekend':
            const dayOfWeek = eventDate.getDay();
            return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
          case 'week':
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= nextWeek;
          case 'month':
            const nextMonth = new Date();
            nextMonth.setMonth(today.getMonth() + 1);
            return eventDate >= today && eventDate <= nextMonth;
          default:
            return true;
        }
      });
      return filteredEvents;
    }
    
    return events;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

/**
 * Get a single event by ID
 * @param id Event ID
 * @returns Promise with event
 */
export const getEventById = async (id: number): Promise<Event> => {
  try {
    // For the fake API integration, we'll use JSONPlaceholder's post by ID endpoint
    const url = `${FAKE_API_URL}/posts/${id}`;
    
    console.log('Fetching event from JSONPlaceholder API:', url);
    
    // Add artificial delay to simulate real-world API latency (remove in production)
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    // Get the raw post data from JSONPlaceholder
    const post = await response.json();
    
    // Create a consistent but seemingly random date based on the post ID
    const seed = id * 24 * 60 * 60 * 1000; // Use ID as seed for consistent randomness
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + (id % 30) + 1); // 1-30 days in the future based on ID
    
    // Get a deterministic price based on ID
    const price = ((id * 17) % 490) + 10; // Price between $10 and $500
    
    // Get a deterministic category based on ID
    const categories = Object.values(EventCategory);
    const category = categories[id % categories.length];
    
    // Get a deterministic location based on ID
    const locations = [
      "New York, NY", 
      "Los Angeles, CA", 
      "Chicago, IL", 
      "Miami, FL", 
      "Austin, TX", 
      "San Francisco, CA", 
      "Seattle, WA",
      "Denver, CO",
      "Boston, MA",
      "Nashville, TN"
    ];
    const location = locations[id % locations.length];
    
    // Transform the JSONPlaceholder post into our Event format
    const event: Event = {
      id: post.id,
      name: post.title,
      description: post.body,
      startDate: futureDate,
      endDate: new Date(futureDate.getTime() + (3 * 60 * 60 * 1000)), // 3 hours later
      location: location,
      price: price,
      category: category,
      imageUrl: `https://picsum.photos/seed/${post.id}/800/600`, // Random image from picsum
      createdAt: new Date(now.getTime() - (id * 24 * 60 * 60 * 1000)) // Older events created earlier
    };
    
    return event;
  } catch (error) {
    console.error(`Failed to fetch event with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new event
 * @param event Event data
 * @returns Promise with created event
 */
export const createEvent = async (event: Omit<Event, 'id' | 'createdAt'>): Promise<Event> => {
  try {
    // For the fake API integration, we'll use JSONPlaceholder's posts endpoint for POST requests
    const url = `${FAKE_API_URL}/posts`;
    
    console.log('Creating event at JSONPlaceholder API:', url);
    console.log('Event data being sent:', event);
    
    // Add artificial delay to simulate real-world API latency (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // JSONPlaceholder expects different fields, but we'll send our event data
      // Note that JSONPlaceholder will always return id: 101 for new posts
      body: JSON.stringify({
        title: event.name,
        body: event.description,
        userId: 1, // Required by JSONPlaceholder
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    // Get the response from JSONPlaceholder
    const responseData = await response.json();
    
    // Transform the response into our Event format with the data we sent plus the new ID
    const now = new Date();
    const createdEvent: Event = {
      ...event, // Include all the original event data
      id: responseData.id, // Use the ID from the response
      createdAt: now,
    };
    
    console.log('Created event:', createdEvent);
    return createdEvent;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
};

/**
 * Build search parameters for events API
 * @param searchTerm Text search term
 * @param dateFilter Date filter value
 * @param locationFilter Location filter value
 * @param categoryFilter Category filter value
 * @param priceRange Price range filter [min, max]
 * @returns Object with query parameters
 */
export const buildSearchParams = (
  searchTerm: string,
  dateFilter: string,
  locationFilter: string,
  categoryFilter: string,
  priceRange: [number, number]
): Record<string, string> => {
  const params: Record<string, string> = {};
  
  if (searchTerm) params.search = searchTerm;
  if (dateFilter && dateFilter !== 'all') params.date = dateFilter;
  if (locationFilter && locationFilter !== 'all') params.location = locationFilter;
  if (categoryFilter && categoryFilter !== 'all') params.category = categoryFilter;
  
  if (priceRange[0] > 0) params.minPrice = priceRange[0].toString();
  if (priceRange[1] < 500) params.maxPrice = priceRange[1].toString();
  
  return params;
};