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

export type AppView = 'home' | 'trips';