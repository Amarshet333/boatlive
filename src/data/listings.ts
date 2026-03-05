import boat1 from "@/assets/boat-1.jpg";
import boat2 from "@/assets/boat-2.jpg";
import boat3 from "@/assets/boat-3.jpg";
import resort1 from "@/assets/resort-1.jpg";
import resort2 from "@/assets/resort-2.jpg";
import resort3 from "@/assets/resort-3.jpg";
import type { Boat, Resort } from "@/types";

export const boats: Boat[] = [
  {
    id: "boat-1",
    name: "Sunrise Shikara",
    image: boat1,
    price: 800,
    capacity: 6,
    duration: "1 hour",
    rating: 4.8,
    reviews: 234,
    location: "Dal Lake, Main Ghat",
    description: "Experience the tranquil beauty of the lake aboard a traditional hand-carved shikara boat. Perfect for families and couples seeking a peaceful ride at dawn.",
    features: ["Cushioned Seats", "Photography Stops", "Guide Included", "Life Jackets"],
  },
  {
    id: "boat-2",
    name: "Aqua Speedster",
    image: boat2,
    price: 2500,
    capacity: 4,
    duration: "30 mins",
    rating: 4.6,
    reviews: 189,
    location: "Lake Point Marina",
    description: "Feel the adrenaline rush on our luxury speedboat. Zip across the crystal-clear waters with panoramic mountain views.",
    features: ["High Speed", "Safety Gear", "Waterproof Storage", "Trained Captain"],
  },
  {
    id: "boat-3",
    name: "Heritage Cruise",
    image: boat3,
    price: 1200,
    capacity: 12,
    duration: "2 hours",
    rating: 4.9,
    reviews: 312,
    location: "Heritage Dock",
    description: "A grand cultural cruise along the historic waterway. Enjoy local music, tea service, and stories from our experienced boatmen.",
    features: ["Tea Service", "Live Music", "Cultural Guide", "Scenic Route"],
  },
];

export const resorts: Resort[] = [
  {
    id: "resort-1",
    name: "Lakewood Lodge",
    image: resort1,
    pricePerNight: 4500,
    rating: 4.7,
    reviews: 456,
    location: "Lakefront Road",
    description: "A charming lakeside lodge with warm wooden interiors, fireplaces, and direct lake access. Wake up to misty mountain views every morning.",
    facilities: ["Lake View", "Restaurant", "Free WiFi", "Parking", "Room Service", "Bonfire Area"],
    roomTypes: ["Standard Room", "Deluxe Lake View", "Family Suite"],
  },
  {
    id: "resort-2",
    name: "Summit Retreat",
    image: resort2,
    pricePerNight: 7200,
    rating: 4.9,
    reviews: 328,
    location: "Mountain View Heights",
    description: "Perched high above the valley, this luxury retreat offers breathtaking sunset views, a spa, and world-class dining.",
    facilities: ["Spa", "Infinity Pool", "Fine Dining", "Mountain View", "Gym", "Helipad"],
    roomTypes: ["Premium Room", "Panorama Suite", "Presidential Villa"],
  },
  {
    id: "resort-3",
    name: "Valley View Resort",
    image: resort3,
    pricePerNight: 5800,
    rating: 4.8,
    reviews: 275,
    location: "Green Valley Estate",
    description: "Surrounded by lush greenery and overlooking the pristine valley, this resort features an infinity pool and adventure activities.",
    facilities: ["Infinity Pool", "Adventure Sports", "Organic Restaurant", "Kids Area", "Yoga Deck", "Bar"],
    roomTypes: ["Garden Room", "Valley Suite", "Pool Villa"],
  },
];
