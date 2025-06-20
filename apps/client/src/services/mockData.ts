import { Destination } from './destinationService';
import { Flight } from './flightService';
import { Hotel } from './hotelService';
import { Package } from './packageService';

// Mock destinations data
export const mockDestinations: Destination[] = [
{
  id: 1,
  name: 'Bali, Indonesia',
  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'Tropical paradise with beautiful beaches and rich culture',
  price: 799.99,
  rating: 4.7
},
{
  id: 2,
  name: 'Paris, France',
  image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'City of love with iconic landmarks and exquisite cuisine',
  price: 899.99,
  rating: 4.5
},
{
  id: 3,
  name: 'Tokyo, Japan',
  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'Blend of traditional culture and ultramodern attractions',
  price: 1099.99,
  rating: 4.8
},
{
  id: 4,
  name: 'Sydney, Australia',
  image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'Beautiful harbor city with iconic opera house and stunning beaches',
  price: 1199.99,
  rating: 4.6
},
{
  id: 5,
  name: 'Santorini, Greece',
  image: 'https://images.unsplash.com/photo-1570077188670-e3a8d3c6f8b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'Breathtaking island with white-washed buildings and blue domes',
  price: 949.99,
  rating: 4.9
},
{
  id: 6,
  name: 'New York, USA',
  image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'Vibrant metropolis with iconic skyscrapers and cultural diversity',
  price: 1050.99,
  rating: 4.4
},
{
  id: 7,
  name: 'Kyoto, Japan',
  image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'Ancient city with temples, shrines, and traditional gardens',
  price: 925.99,
  rating: 4.8
},
{
  id: 8,
  name: 'Maldives',
  image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'Tropical paradise with overwater bungalows and pristine beaches',
  price: 1399.99,
  rating: 4.9
},
{
  id: 9,
  name: 'Barcelona, Spain',
  image: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'Vibrant city with unique architecture and Mediterranean beaches',
  price: 875.99,
  rating: 4.5
},
{
  id: 10,
  name: 'Cape Town, South Africa',
  image: 'https://images.unsplash.com/photo-1562338082-e6b5578c0604?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  description: 'Stunning coastal city with Table Mountain and diverse culture',
  price: 1099.99,
  rating: 4.7
}];



// Mock flights data
export const mockFlights: Flight[] = [
{
  id: 1,
  airline: 'AirAsia',
  flight_number: 'AA101',
  origin: 'Kuala Lumpur',
  destination: 'Bali',
  departure_time: '2023-12-15 08:00:00',
  arrival_time: '2023-12-15 11:00:00',
  price: 299.99,
  available_seats: 120
},
{
  id: 2,
  airline: 'AirAsia',
  flight_number: 'AA102',
  origin: 'Bali',
  destination: 'Kuala Lumpur',
  departure_time: '2023-12-22 12:00:00',
  arrival_time: '2023-12-22 15:00:00',
  price: 299.99,
  available_seats: 110
},
{
  id: 3,
  airline: 'AirAsia',
  flight_number: 'AA205',
  origin: 'Kuala Lumpur',
  destination: 'Tokyo',
  departure_time: '2023-12-17 10:30:00',
  arrival_time: '2023-12-17 18:45:00',
  price: 520.50,
  available_seats: 85
},
{
  id: 4,
  airline: 'Singapore Airlines',
  flight_number: 'SQ189',
  origin: 'Singapore',
  destination: 'Paris',
  departure_time: '2023-12-20 23:45:00',
  arrival_time: '2023-12-21 06:30:00',
  price: 890.75,
  available_seats: 42
},
{
  id: 5,
  airline: 'Emirates',
  flight_number: 'EK412',
  origin: 'Dubai',
  destination: 'Sydney',
  departure_time: '2023-12-18 02:15:00',
  arrival_time: '2023-12-18 22:05:00',
  price: 1250.00,
  available_seats: 28
},
{
  id: 6,
  airline: 'Qatar Airways',
  flight_number: 'QR701',
  origin: 'Doha',
  destination: 'New York',
  departure_time: '2023-12-25 01:30:00',
  arrival_time: '2023-12-25 07:45:00',
  price: 975.25,
  available_seats: 56
},
{
  id: 7,
  airline: 'Lufthansa',
  flight_number: 'LH430',
  origin: 'Frankfurt',
  destination: 'Tokyo',
  departure_time: '2023-12-22 14:20:00',
  arrival_time: '2023-12-23 10:35:00',
  price: 830.50,
  available_seats: 63
},
{
  id: 8,
  airline: 'British Airways',
  flight_number: 'BA112',
  origin: 'London',
  destination: 'Cape Town',
  departure_time: '2023-12-19 21:15:00',
  arrival_time: '2023-12-20 10:30:00',
  price: 915.75,
  available_seats: 39
},
{
  id: 9,
  airline: 'AirAsia',
  flight_number: 'AA307',
  origin: 'Kuala Lumpur',
  destination: 'Bangkok',
  departure_time: '2023-12-28 16:45:00',
  arrival_time: '2023-12-28 17:45:00',
  price: 189.99,
  available_seats: 135
},
{
  id: 10,
  airline: 'Cathay Pacific',
  flight_number: 'CX826',
  origin: 'Hong Kong',
  destination: 'Maldives',
  departure_time: '2023-12-30 09:20:00',
  arrival_time: '2023-12-30 12:45:00',
  price: 680.50,
  available_seats: 72
}];



// Mock hotels data
export const mockHotels: Hotel[] = [
{
  id: 1,
  name: 'Bali Beach Resort',
  location: 'Kuta, Bali',
  description: 'Luxurious beachfront resort with stunning ocean views',
  price_per_night: 150.00,
  rating: 4.6,
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Beach Access']
},
{
  id: 2,
  name: 'Paris Elegance Hotel',
  location: 'Central Paris',
  description: 'Elegant hotel in the heart of Paris, walking distance to major attractions',
  price_per_night: 200.00,
  rating: 4.4,
  image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Restaurant', 'Bar', 'Free WiFi', 'Room Service', 'Concierge']
},
{
  id: 3,
  name: 'Tokyo Skyline Hotel',
  location: 'Shinjuku, Tokyo',
  description: 'Modern hotel with panoramic city views and convenient access to transport',
  price_per_night: 180.00,
  rating: 4.7,
  image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Restaurant', 'Fitness Center', 'Free WiFi', 'Business Center', 'Bar']
},
{
  id: 4,
  name: 'Sydney Harbour View',
  location: 'Circular Quay, Sydney',
  description: 'Upscale accommodation with stunning views of Sydney Opera House and Harbour Bridge',
  price_per_night: 250.00,
  rating: 4.8,
  image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Rooftop Pool', 'Spa', 'Fine Dining', 'Free WiFi', 'Concierge']
},
{
  id: 5,
  name: 'Santorini Blue Suites',
  location: 'Oia, Santorini',
  description: 'Boutique hotel with private infinity pools and caldera views',
  price_per_night: 320.00,
  rating: 4.9,
  image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Private Pools', 'Spa', 'Restaurant', 'Free WiFi', 'Airport Shuttle']
},
{
  id: 6,
  name: 'Manhattan Luxury Suites',
  location: 'Midtown, New York',
  description: 'Sophisticated hotel in the heart of Manhattan with skyline views',
  price_per_night: 280.00,
  rating: 4.5,
  image: 'https://images.unsplash.com/photo-1594560913095-8cf34baf3fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Fitness Center', 'Restaurant', 'Business Center', 'Free WiFi', 'Concierge']
},
{
  id: 7,
  name: 'Kyoto Traditional Ryokan',
  location: 'Gion, Kyoto',
  description: 'Authentic Japanese inn with tatami rooms and traditional garden',
  price_per_night: 190.00,
  rating: 4.7,
  image: 'https://images.unsplash.com/photo-1547301999-464438e2fe95?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Hot Springs', 'Traditional Cuisine', 'Garden', 'Yukata Provided', 'Tea Ceremony']
},
{
  id: 8,
  name: 'Maldives Water Villa Resort',
  location: 'North Malé Atoll, Maldives',
  description: 'Luxurious overwater villas with direct ocean access and private decks',
  price_per_night: 450.00,
  rating: 4.9,
  image: 'https://images.unsplash.com/photo-1583245117684-037bb5d85d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Private Pool', 'Snorkeling Equipment', 'Spa', 'Multiple Restaurants', 'Water Sports']
},
{
  id: 9,
  name: 'Barcelona Gothic Quarter Inn',
  location: 'Gothic Quarter, Barcelona',
  description: 'Charming boutique hotel in a historic building with modern amenities',
  price_per_night: 170.00,
  rating: 4.6,
  image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Rooftop Terrace', 'Bar', 'Free WiFi', 'Breakfast Included', 'Tour Desk']
},
{
  id: 10,
  name: 'Cape Town Waterfront Hotel',
  location: 'V&A Waterfront, Cape Town',
  description: 'Modern hotel with views of Table Mountain and the harbor',
  price_per_night: 210.00,
  rating: 4.5,
  image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  amenities: ['Pool', 'Fitness Center', 'Restaurant', 'Free WiFi', 'Concierge']
}];


// Mock car rental data
export const mockCars = [
{
  id: 1,
  name: "Toyota Avanza",
  price: 150,
  location: "Bali",
  image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  category: "Economy",
  features: ["4 Seats", "2 Bags", "Automatic"]
},
{
  id: 2,
  name: "Honda CR-V",
  price: 220,
  location: "Paris",
  image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxBJTIwSG9uZGElMjBDUi1WJTIwcGFya2VkJTIwaW4lMjBhJTIwc2NlbmljJTIwb3V0ZG9vciUyMGxvY2F0aW9uLnxlbnwwfHx8fDE3NDc3OTYxMzh8MA&ixlib=rb-4.1.0&q=80&w=200$w=500",
  category: "SUV",
  features: ["5 Seats", "3 Bags", "Automatic"]
},
{
  id: 3,
  name: "BMW 3 Series",
  price: 350,
  location: "Tokyo",
  image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  category: "Luxury",
  features: ["5 Seats", "2 Bags", "Automatic"]
},
{
  id: 4,
  name: "Toyota Corolla",
  price: 180,
  location: "Sydney",
  image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  category: "Economy",
  features: ["5 Seats", "2 Bags", "Automatic"]
},
{
  id: 5,
  name: "Mercedes-Benz E-Class",
  price: 400,
  location: "New York",
  image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  category: "Luxury",
  features: ["5 Seats", "3 Bags", "Automatic", "Leather Interior"]
},
{
  id: 6,
  name: "Hyundai Tucson",
  price: 200,
  location: "Barcelona",
  image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  category: "SUV",
  features: ["5 Seats", "3 Bags", "Automatic", "Navigation"]
},
{
  id: 7,
  name: "Volkswagen Golf",
  price: 175,
  location: "Santorini",
  image: "https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  category: "Compact",
  features: ["5 Seats", "2 Bags", "Manual", "Fuel Efficient"]
},
{
  id: 8,
  name: "Range Rover Sport",
  price: 450,
  location: "Cape Town",
  image: "https://images.unsplash.com/photo-1539795845756-4fadad2905ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  category: "Luxury SUV",
  features: ["7 Seats", "4 Bags", "Automatic", "4x4", "Premium Sound"]
},
{
  id: 9,
  name: "Toyota Prius",
  price: 165,
  location: "Kyoto",
  image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  category: "Hybrid",
  features: ["5 Seats", "2 Bags", "Automatic", "Eco-friendly"]
},
{
  id: 10,
  name: "Jeep Wrangler",
  price: 280,
  location: "Maldives",
  image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  category: "Off-road",
  features: ["4 Seats", "2 Bags", "Manual", "4x4", "Convertible"]
}];


// Mock packages data
export const mockPackages: Package[] = [
{
  id: 1,
  name: 'Bali Bliss',
  destination: 'Bali, Indonesia',
  description: 'Experience the best of Bali with this all-inclusive package',
  price: 1299.99,
  duration: 7,
  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '7 nights accommodation', 'Daily breakfast', 'Airport transfers', 'Full-day island tour'],
  start_date: '2023-12-15',
  end_date: '2023-12-22'
},
{
  id: 2,
  name: 'Paris Romance',
  destination: 'Paris, France',
  description: 'Romantic getaway in the city of love',
  price: 1499.99,
  duration: 5,
  image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '5 nights accommodation', 'Daily breakfast', 'Seine river cruise', 'Skip-the-line Eiffel Tower tickets'],
  start_date: '2023-12-10',
  end_date: '2023-12-15'
},
{
  id: 3,
  name: 'Tokyo Explorer',
  destination: 'Tokyo, Japan',
  description: 'Urban adventure in the futuristic metropolis of Tokyo',
  price: 1699.99,
  duration: 6,
  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '6 nights accommodation', 'Tokyo metro pass', 'Guided city tour', 'Day trip to Mt. Fuji'],
  start_date: '2023-12-18',
  end_date: '2023-12-24'
},
{
  id: 4,
  name: 'Sydney Adventure',
  destination: 'Sydney, Australia',
  description: 'Explore the stunning harbor city and surrounding attractions',
  price: 1899.99,
  duration: 8,
  image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '8 nights accommodation', 'Sydney Opera House tour', 'Blue Mountains excursion', 'Harbor cruise'],
  start_date: '2024-01-05',
  end_date: '2024-01-13'
},
{
  id: 5,
  name: 'Santorini Sunset',
  destination: 'Santorini, Greece',
  description: 'Luxurious island escape with breathtaking caldera views',
  price: 1599.99,
  duration: 6,
  image: 'https://images.unsplash.com/photo-1570077188670-e3a8d3c6f8b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '6 nights in cave suite', 'Daily breakfast', 'Wine tasting tour', 'Sunset catamaran cruise'],
  start_date: '2024-01-10',
  end_date: '2024-01-16'
},
{
  id: 6,
  name: 'New York City Break',
  destination: 'New York, USA',
  description: 'Big Apple adventure with Broadway shows and iconic sights',
  price: 1399.99,
  duration: 5,
  image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '5 nights accommodation', 'Broadway show tickets', 'CityPASS for attractions', 'Helicopter tour'],
  start_date: '2024-01-15',
  end_date: '2024-01-20'
},
{
  id: 7,
  name: 'Kyoto Cultural Immersion',
  destination: 'Kyoto, Japan',
  description: 'Traditional Japanese experience in the ancient capital',
  price: 1599.99,
  duration: 7,
  image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '7 nights in ryokan', 'Tea ceremony experience', 'Kimono rental', 'Temple and shrine tour'],
  start_date: '2024-01-20',
  end_date: '2024-01-27'
},
{
  id: 8,
  name: 'Maldives Paradise',
  destination: 'Maldives',
  description: 'Ultimate luxury vacation in overwater bungalows',
  price: 2499.99,
  duration: 7,
  image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '7 nights in overwater villa', 'All-inclusive meals', 'Snorkeling equipment', 'Couples massage'],
  start_date: '2024-02-01',
  end_date: '2024-02-08'
},
{
  id: 9,
  name: 'Barcelona Fiesta',
  destination: 'Barcelona, Spain',
  description: 'Experience Catalan culture, architecture, and Mediterranean beaches',
  price: 1299.99,
  duration: 6,
  image: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '6 nights accommodation', 'Sagrada Familia tickets', 'Tapas tour', 'Day trip to Montserrat'],
  start_date: '2024-02-10',
  end_date: '2024-02-16'
},
{
  id: 10,
  name: 'Cape Town Explorer',
  destination: 'Cape Town, South Africa',
  description: 'Adventure at the meeting point of two oceans with stunning landscapes',
  price: 1799.99,
  duration: 8,
  image: 'https://images.unsplash.com/photo-1562338082-e6b5578c0604?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  included_items: ['Round-trip flights', '8 nights accommodation', 'Table Mountain cable car', 'Cape Peninsula tour', 'Wine tasting in Stellenbosch'],
  start_date: '2024-02-15',
  end_date: '2024-02-23'
}];


// Mock car reservations data
export const mockCarReservations = [
{
  id: "1",
  carName: "Toyota Avanza",
  startDate: "23 Jan 2023",
  endDate: "25 Jan 2023",
  location: "Bali",
  price: 300,
  status: "active" as const
},
{
  id: "2",
  carName: "Honda CR-V",
  startDate: "15 Feb 2023",
  endDate: "20 Feb 2023",
  location: "Paris",
  price: 1100,
  status: "upcoming" as const
},
{
  id: "3",
  carName: "BMW 3 Series",
  startDate: "10 Mar 2023",
  endDate: "15 Mar 2023",
  location: "Tokyo",
  price: 1750,
  status: "upcoming" as const
},
{
  id: "4",
  carName: "Mercedes-Benz E-Class",
  startDate: "5 Apr 2023",
  endDate: "12 Apr 2023",
  location: "New York",
  price: 2800,
  status: "upcoming" as const
},
{
  id: "5",
  carName: "Range Rover Sport",
  startDate: "1 Dec 2022",
  endDate: "8 Dec 2022",
  location: "Cape Town",
  price: 3150,
  status: "completed" as const
}];


// Mock car reviews data
export const mockCarReviews = [
{
  id: "1",
  userName: "John Smith",
  rating: 5,
  date: "15 Jan 2023",
  comment: "Great experience with the car rental. The vehicle was clean and in excellent condition."
},
{
  id: "2",
  userName: "Sarah Johnson",
  rating: 4,
  date: "20 Dec 2022",
  comment: "Good service, but the pickup process took longer than expected. Otherwise, the car was perfect for our trip."
},
{
  id: "3",
  userName: "Michael Wong",
  rating: 5,
  date: "5 Feb 2023",
  comment: "Exceptional service! The staff was friendly and the car was exactly what we needed for our family vacation."
},
{
  id: "4",
  userName: "Emma Davis",
  rating: 3,
  date: "12 Mar 2023",
  comment: "The car was fine but it had some minor issues with the air conditioning. Customer service was helpful in resolving it."
},
{
  id: "5",
  userName: "Robert Chen",
  rating: 5,
  date: "30 Jan 2023",
  comment: "Smooth rental process from start to finish. Will definitely use this service again for my next trip."
},
{
  id: "6",
  userName: "Sophia Garcia",
  rating: 4,
  date: "18 Feb 2023",
  comment: "Good value for money. The car was fuel-efficient and comfortable for our road trip."
}];


// Mock user activity data for AI features testing
export const mockUserActivities = [
{
  userId: "user1",
  searchHistory: ["Bali", "beach resorts", "tropical destinations"],
  clickedItems: [1, 5, 8], // destination IDs
  bookingHistory: [
  { type: "hotel", id: 1, date: "2023-10-15" },
  { type: "flight", id: 1, date: "2023-10-15" }],

  preferences: {
    budget: "medium",
    accommodation: "resort",
    activities: ["beach", "spa", "sightseeing"]
  }
},
{
  userId: "user2",
  searchHistory: ["Tokyo", "Japan travel", "cultural experiences"],
  clickedItems: [3, 7], // destination IDs
  bookingHistory: [
  { type: "package", id: 3, date: "2023-11-20" }],

  preferences: {
    budget: "high",
    accommodation: "luxury",
    activities: ["shopping", "fine dining", "cultural tours"]
  }
},
{
  userId: "user3",
  searchHistory: ["family vacation", "kid-friendly", "all-inclusive"],
  clickedItems: [4, 6, 9], // destination IDs
  bookingHistory: [
  { type: "hotel", id: 6, date: "2023-09-05" },
  { type: "car", id: 2, date: "2023-09-05" }],

  preferences: {
    budget: "medium",
    accommodation: "family-friendly",
    activities: ["swimming", "sightseeing", "parks"]
  }
},
{
  userId: "user4",
  searchHistory: ["luxury travel", "5-star hotels", "exclusive resorts"],
  clickedItems: [5, 8, 10], // destination IDs
  bookingHistory: [
  { type: "package", id: 8, date: "2023-12-01" },
  { type: "car", id: 5, date: "2023-12-01" }],

  preferences: {
    budget: "high",
    accommodation: "luxury",
    activities: ["spa", "fine dining", "private tours"]
  }
},
{
  userId: "user5",
  searchHistory: ["adventure travel", "hiking", "outdoor activities"],
  clickedItems: [4, 10], // destination IDs
  bookingHistory: [
  { type: "package", id: 10, date: "2023-08-15" },
  { type: "car", id: 8, date: "2023-08-15" }],

  preferences: {
    budget: "medium",
    accommodation: "boutique",
    activities: ["hiking", "wildlife", "photography"]
  }
}];