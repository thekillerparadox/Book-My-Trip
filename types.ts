
export interface Mood {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
}

export interface Destination {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  state?: string; // New field for domestic state filtering
}

export interface FeaturedDestination extends Destination {
  isTopChoice?: boolean;
  tags?: string[];
  pricePerPerson?: boolean;
  region?: string;
  bestTimeToVisit?: string;
  suggestedActivities?: string[];
}

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  tag: string;
  stats: {
    temp: string;
    popularity: string;
    activity: string;
  };
}

export enum BookingType {
  FLIGHTS = 'Flights',
  HOTELS = 'Hotels',
  ACTIVITIES = 'Activities'
}

export interface Trip {
  id: string;
  destinationName: string;
  image: string;
  dates: string;
  travelers: string;
  price: string;
  type: string;
  bookedAt: number;
}

export interface ReviewResponse {
  responderName: string;
  responderTitle: string;
  responderAvatar: string;
  message: string;
  videoUrl?: string;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  trip: string;
  date: string;
  isVerified: boolean;
  helpfulCount: number;
  videoUrl?: string; // For video testimonials
  thumbnail?: string; // For video thumbnail
  travelType?: 'Solo' | 'Family' | 'Couple' | 'Business' | 'Adventure';
  response?: ReviewResponse;
}

export type AppView = 'home' | 'trips';