export interface Boat {
  id: string;
  name: string;
  image: string;
  price: number;
  capacity: number;
  duration: string;
  rating: number;
  reviews: number;
  location: string;
  description: string;
  features: string[];
}

export interface Resort {
  id: string;
  name: string;
  image: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  location: string;
  description: string;
  facilities: string[];
  roomTypes: string[];
}
