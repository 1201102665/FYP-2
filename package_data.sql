-- Real Package Data for AeroTrav
-- Insert comprehensive travel packages with detailed itineraries

INSERT INTO `packages` (
  `name`, `slug`, `destination_city`, `destination_country`, `category`, 
  `duration_days`, `duration_nights`, `min_travelers`, `max_travelers`, 
  `description`, `highlights`, `itinerary`, `included_items`, `excluded_items`, 
  `images`, `base_price`, `child_price`, `single_supplement`, 
  `available_dates`, `booking_deadline_days`, `cancellation_policy`, 
  `difficulty_level`, `physical_requirements`, `recommended_age_min`, 
  `recommended_age_max`, `group_size_min`, `group_size_max`, 
  `guide_included`, `meals_included`, `accommodation_level`, 
  `status`, `featured`
) VALUES 

-- Package 1: Bali Paradise Escape
(
  'Bali Paradise Escape',
  'bali-paradise-escape',
  'Denpasar',
  'Indonesia',
  'relaxation',
  7,
  6,
  1,
  8,
  'Immerse yourself in the beauty of Bali with this all-inclusive package featuring luxury accommodations, cultural experiences, and breathtaking beaches. Discover the island\'s rich culture, visit ancient temples, relax on pristine beaches, and indulge in delicious Balinese cuisine.',
  '["Visit iconic Tanah Lot Temple", "Sunrise trek at Mount Batur", "Traditional Balinese spa treatments", "Ubud cultural immersion", "Beach relaxation at Nusa Dua", "Rice terrace exploration"]',
  '[
    {
      "day": 1,
      "title": "Arrival in Bali",
      "description": "Arrive at Denpasar International Airport and transfer to your luxury resort in Ubud.",
      "activities": ["Airport pickup", "Resort check-in", "Welcome dinner", "Evening orientation"]
    },
    {
      "day": 2,
      "title": "Ubud Cultural Tour",
      "description": "Explore the cultural heart of Bali with visits to ancient temples and artisan workshops.",
      "activities": ["Ubud Palace visit", "Sacred Monkey Forest", "Traditional art galleries", "Local lunch at warung", "Silver jewelry workshop"]
    },
    {
      "day": 3,
      "title": "Mount Batur Sunrise Trek",
      "description": "Early morning trek up Mount Batur to witness a spectacular sunrise over the island.",
      "activities": ["Pre-dawn pickup (3:30 AM)", "Guided trek to summit", "Sunrise viewing", "Breakfast at summit", "Hot springs relaxation"]
    },
    {
      "day": 4,
      "title": "Beach Day at Nusa Dua",
      "description": "Relax at one of Bali\'s most beautiful beaches with optional water activities.",
      "activities": ["Transfer to Nusa Dua", "Beach relaxation", "Snorkeling session", "Beachside lunch", "Sunset cocktails"]
    },
    {
      "day": 5,
      "title": "Temples and Rice Terraces",
      "description": "Visit Bali\'s most iconic temples and the stunning Tegallalang Rice Terraces.",
      "activities": ["Tanah Lot Temple", "Tegallalang Rice Terraces", "Traditional lunch", "Kecak fire dance performance"]
    },
    {
      "day": 6,
      "title": "Spa Day and Shopping",
      "description": "Indulge in a traditional Balinese spa treatment and browse local markets.",
      "activities": ["Full body Balinese massage", "Flower bath ceremony", "Ubud Market shopping", "Cooking class", "Farewell dinner"]
    },
    {
      "day": 7,
      "title": "Departure Day",
      "description": "Final day to enjoy resort amenities before departure.",
      "activities": ["Late checkout", "Last-minute shopping", "Airport transfer"]
    }
  ]',
  '["Round-trip airport transfers", "6 nights luxury accommodation", "Daily breakfast", "Welcome and farewell dinners", "All guided tours and activities", "Entrance fees to attractions", "Professional English-speaking guide", "Travel insurance", "24/7 customer support"]',
  '["International flights", "Personal expenses", "Alcoholic beverages (except included meals)", "Additional spa treatments", "Gratuities for guides and drivers", "Visa fees (if applicable)", "Travel insurance upgrade"]',
  '["https://images.unsplash.com/photo-1537996194471-e657df975ab4", "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b", "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8"]',
  1299.00,
  899.00,
  250.00,
  '["2024-07-15", "2024-08-01", "2024-08-15", "2024-09-01", "2024-09-15", "2024-10-01"]',
  14,
  'Free cancellation up to 14 days before departure. 50% refund for cancellations 7-14 days before. No refund for cancellations within 7 days.',
  'easy',
  'Moderate walking required for temple visits and rice terrace exploration. Mount Batur trek requires basic fitness level.',
  12,
  75,
  1,
  10,
  1,
  'half-board',
  'luxury',
  'active',
  1
),

-- Package 2: Tokyo Cultural Discovery
(
  'Tokyo Cultural Discovery',
  'tokyo-cultural-discovery',
  'Tokyo',
  'Japan',
  'cultural',
  5,
  4,
  1,
  6,
  'Discover the fascinating blend of traditional and modern Japan in Tokyo. Experience ancient temples, cutting-edge technology, delicious cuisine, and vibrant neighborhoods in this comprehensive cultural tour.',
  '["Visit historic Senso-ji Temple", "Experience traditional tea ceremony", "Explore vibrant Shibuya crossing", "Taste authentic sushi at Tsukiji", "Discover modern technology in Akihabara", "Traditional ryokan experience"]',
  '[
    {
      "day": 1,
      "title": "Arrival and Asakusa District",
      "description": "Arrive in Tokyo and explore the traditional Asakusa district.",
      "activities": ["Airport pickup", "Hotel check-in", "Senso-ji Temple visit", "Nakamise shopping street", "Traditional dinner"]
    },
    {
      "day": 2,
      "title": "Imperial Palace and Ginza",
      "description": "Visit the Imperial Palace gardens and explore upscale Ginza district.",
      "activities": ["Imperial Palace East Gardens", "Traditional tea ceremony", "Ginza shopping district", "Sushi lunch at Tsukiji", "Kabuki theater (optional)"]
    },
    {
      "day": 3,
      "title": "Modern Tokyo - Shibuya and Harajuku",
      "description": "Experience modern Tokyo culture in trendy neighborhoods.",
      "activities": ["Shibuya crossing experience", "Harajuku fashion district", "Meiji Shrine visit", "Takeshita Street shopping", "Robot restaurant show"]
    },
    {
      "day": 4,
      "title": "Technology and Tradition",
      "description": "Explore high-tech Akihabara and traditional crafts.",
      "activities": ["Akihabara electronics district", "Traditional craft workshop", "Tokyo Skytree visit", "Sumida River cruise", "Farewell dinner"]
    },
    {
      "day": 5,
      "title": "Departure",
      "description": "Last-minute shopping and departure.",
      "activities": ["Free morning", "Last-minute shopping", "Airport transfer"]
    }
  ]',
  '["4 nights hotel accommodation", "Daily breakfast", "Welcome and farewell dinners", "All guided tours", "Entrance fees", "Professional guide", "Airport transfers", "JR Pass for local transport"]',
  '["International flights", "Lunch and dinner (except mentioned)", "Personal expenses", "Optional activities", "Gratuities", "Travel insurance"]',
  '["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf", "https://images.unsplash.com/photo-1513407030348-c983a97b98d8", "https://images.unsplash.com/photo-1542051841857-5f90071e7989"]',
  1599.00,
  1199.00,
  300.00,
  '["2024-06-01", "2024-06-15", "2024-07-01", "2024-07-15", "2024-08-01", "2024-09-01"]',
  10,
  'Free cancellation up to 10 days before departure. 25% refund for cancellations 5-10 days before.',
  'easy',
  'Extensive walking in urban environment. Good fitness level recommended.',
  8,
  80,
  1,
  6,
  1,
  'breakfast',
  'superior',
  'active',
  1
),

-- Package 3: Swiss Alps Adventure
(
  'Swiss Alps Adventure',
  'swiss-alps-adventure',
  'Interlaken',
  'Switzerland',
  'adventure',
  6,
  5,
  2,
  8,
  'Experience the breathtaking Swiss Alps with this adventure-packed tour. Enjoy scenic train rides, mountain hiking, paragliding, and charming alpine villages in one of the world\'s most beautiful mountain regions.',
  '["Scenic Jungfraujoch railway", "Paragliding over Interlaken", "Hiking in pristine alpine trails", "Traditional Swiss fondue", "Cable car adventures", "Crystal-clear mountain lakes"]',
  '[
    {
      "day": 1,
      "title": "Arrival in Interlaken",
      "description": "Arrive in the heart of the Swiss Alps and settle into your mountain resort.",
      "activities": ["Airport/station pickup", "Hotel check-in", "Interlaken town walk", "Welcome dinner with Swiss specialties"]
    },
    {
      "day": 2,
      "title": "Jungfraujoch - Top of Europe",
      "description": "Take the famous cogwheel train to Jungfraujoch, the highest railway station in Europe.",
      "activities": ["Early morning train to Jungfraujoch", "Ice Palace visit", "Sphinx Observatory", "Alpine lunch", "Afternoon in Grindelwald"]
    },
    {
      "day": 3,
      "title": "Adventure Day - Paragliding and Hiking",
      "description": "Experience the thrill of paragliding and explore mountain trails.",
      "activities": ["Paragliding tandem flight", "Mountain hiking (3-4 hours)", "Alpine picnic lunch", "Cable car ride", "Evening relaxation"]
    },
    {
      "day": 4,
      "title": "Lake Thun and Spiez",
      "description": "Explore beautiful Lake Thun and the charming town of Spiez.",
      "activities": ["Lake Thun boat cruise", "Spiez Castle visit", "Lakeside lunch", "Wine tasting", "Traditional Swiss dinner"]
    },
    {
      "day": 5,
      "title": "Alpine Culture and Relaxation",
      "description": "Experience Swiss culture and enjoy spa treatments.",
      "activities": ["Traditional cheese making demo", "Alpine spa treatments", "Mountain cable car", "Shopping for Swiss souvenirs", "Farewell fondue dinner"]
    },
    {
      "day": 6,
      "title": "Departure",
      "description": "Final morning in the Alps before departure.",
      "activities": ["Final mountain views", "Hotel checkout", "Airport/station transfer"]
    }
  ]',
  '["5 nights mountain resort accommodation", "Daily breakfast", "Welcome and farewell dinners", "All guided tours and activities", "Paragliding experience", "Train tickets", "Cable car passes", "Professional guide", "Airport transfers"]',
  '["International flights", "Lunch (except mentioned)", "Personal expenses", "Additional adventure activities", "Alcoholic beverages", "Gratuities", "Travel insurance"]',
  '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4", "https://images.unsplash.com/photo-1551524164-d467b7119b0b", "https://images.unsplash.com/photo-1551524164-a0b4e1e1c4c7"]',
  1899.00,
  1399.00,
  400.00,
  '["2024-06-01", "2024-06-15", "2024-07-01", "2024-07-15", "2024-08-01", "2024-08-15"]',
  14,
  'Standard cancellation policy. 50% refund up to 14 days before departure.',
  'moderate',
  'Good physical fitness required for hiking and adventure activities.',
  16,
  70,
  2,
  8,
  1,
  'half-board',
  'superior',
  'active',
  1
),

-- Package 4: Paris Romance Getaway
(
  'Paris Romance Getaway',
  'paris-romance-getaway',
  'Paris',
  'France',
  'romantic',
  4,
  3,
  2,
  6,
  'Experience the magic of Paris with this romantic getaway. Enjoy intimate dinners, Seine river cruises, visits to iconic landmarks, and charming walks through historic neighborhoods.',
  '["Eiffel Tower dinner experience", "Seine river cruise", "Louvre Museum private tour", "Montmartre artistic quarter", "Champagne tasting", "Romantic horse carriage ride"]',
  '[
    {
      "day": 1,
      "title": "Arrival and Romantic Evening",
      "description": "Arrive in the City of Love and enjoy your first romantic evening.",
      "activities": ["Airport pickup", "Luxury hotel check-in", "Welcome champagne", "Seine river dinner cruise", "Evening Eiffel Tower visit"]
    },
    {
      "day": 2,
      "title": "Classic Paris Romance",
      "description": "Explore the most romantic spots in Paris.",
      "activities": ["Louvre Museum private tour", "Lunch at Café de Flore", "Stroll through Tuileries Garden", "Sunset at Sacré-Cœur", "Dinner in Montmartre"]
    },
    {
      "day": 3,
      "title": "Hidden Gems and Culture",
      "description": "Discover Paris\'s hidden romantic corners and cultural treasures.",
      "activities": ["Le Marais district walk", "Wine and cheese tasting", "Latin Quarter exploration", "Notre-Dame area", "Romantic dinner at Michelin restaurant"]
    },
    {
      "day": 4,
      "title": "Farewell to Paris",
      "description": "Last romantic moments before departure.",
      "activities": ["Morning at Champs-Élysées", "Last-minute shopping", "Farewell lunch", "Airport transfer"]
    }
  ]',
  '["3 nights luxury hotel accommodation", "Daily breakfast", "Welcome champagne", "Seine river dinner cruise", "Louvre Museum private tour", "Wine and cheese tasting", "One Michelin-starred dinner", "Airport transfers", "Professional guide"]',
  '["International flights", "Lunch and dinner (except mentioned)", "Personal expenses", "Additional museum entries", "Shopping", "Gratuities", "Travel insurance"]',
  '["https://images.unsplash.com/photo-1502602898536-47ad22581b52", "https://images.unsplash.com/photo-1549144511-f099e773c147", "https://images.unsplash.com/photo-1541961017774-22349e4a1262"]',
  1799.00,
  1299.00,
  350.00,
  '["2024-05-01", "2024-05-15", "2024-06-01", "2024-06-15", "2024-09-01", "2024-09-15"]',
  7,
  'Flexible cancellation up to 7 days before departure.',
  'easy',
  'Extensive walking in city environment. Basic fitness level sufficient.',
  18,
  80,
  2,
  6,
  1,
  'breakfast',
  'luxury',
  'active',
  1
),

-- Package 5: Thailand Island Hopping
(
  'Thailand Island Hopping',
  'thailand-island-hopping',
  'Bangkok',
  'Thailand',
  'beach',
  8,
  7,
  1,
  10,
  'Discover the tropical paradise of Thailand with this comprehensive island hopping adventure. Experience bustling Bangkok, pristine beaches, crystal-clear waters, vibrant marine life, and authentic Thai culture across multiple stunning islands.',
  '["Visit 4 different Thai islands", "Snorkeling in crystal waters", "Traditional longtail boat rides", "Thai cooking classes", "Beach sunset experiences", "Floating market visits"]',
  '[
    {
      "day": 1,
      "title": "Bangkok Arrival",
      "description": "Arrive in Bangkok and explore the vibrant capital.",
      "activities": ["Airport pickup", "Hotel check-in", "Grand Palace visit", "Wat Pho temple", "Traditional Thai dinner"]
    },
    {
      "day": 2,
      "title": "Bangkok to Koh Phi Phi",
      "description": "Travel to the famous Koh Phi Phi islands.",
      "activities": ["Floating market visit", "Flight to Phuket", "Speedboat to Phi Phi", "Beach resort check-in", "Sunset viewing"]
    },
    {
      "day": 3,
      "title": "Phi Phi Island Exploration",
      "description": "Explore the stunning Phi Phi islands and surrounding waters.",
      "activities": ["Maya Bay visit", "Snorkeling at Bamboo Island", "Longtail boat tour", "Beach relaxation", "Fire show evening"]
    },
    {
      "day": 4,
      "title": "Koh Samui Transfer",
      "description": "Travel to beautiful Koh Samui island.",
      "activities": ["Morning at Phi Phi", "Flight to Koh Samui", "Beach resort check-in", "Island orientation tour", "Beachside dinner"]
    },
    {
      "day": 5,
      "title": "Koh Samui Adventures",
      "description": "Experience the best of Koh Samui.",
      "activities": ["Ang Thong Marine Park tour", "Kayaking adventure", "Snorkeling session", "Beach BBQ lunch", "Thai massage"]
    },
    {
      "day": 6,
      "title": "Koh Tao Day Trip",
      "description": "Visit the diving paradise of Koh Tao.",
      "activities": ["Early boat to Koh Tao", "Diving/snorkeling at best spots", "Island lunch", "Beach time", "Return to Koh Samui"]
    },
    {
      "day": 7,
      "title": "Cultural Immersion",
      "description": "Experience authentic Thai culture and cuisine.",
      "activities": ["Thai cooking class", "Local market visit", "Temple visits", "Traditional craft workshop", "Farewell dinner"]
    },
    {
      "day": 8,
      "title": "Departure",
      "description": "Final day and departure.",
      "activities": ["Free morning", "Last-minute shopping", "Airport transfer", "Flight departure"]
    }
  ]',
  '["7 nights accommodation (Bangkok + islands)", "Daily breakfast", "4 dinners", "All inter-island transfers", "Speedboat tours", "Snorkeling equipment", "Cooking class", "Professional guide", "Airport transfers"]',
  '["International flights", "Lunch (except mentioned)", "Alcoholic beverages", "Diving certification", "Personal expenses", "Gratuities", "Travel insurance"]',
  '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b", "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b"]',
  1699.00,
  1299.00,
  350.00,
  '["2024-06-01", "2024-06-15", "2024-07-01", "2024-07-15", "2024-08-01", "2024-08-15", "2024-09-01"]',
  14,
  'Free cancellation up to 14 days before departure. 50% refund for cancellations 7-14 days before.',
  'moderate',
  'Swimming ability required. Good fitness for boat transfers and water activities.',
  12,
  70,
  1,
  10,
  1,
  'half-board',
  'standard',
  'active',
  1
),

-- Package 6: Iceland Northern Lights Adventure
(
  'Iceland Northern Lights Adventure',
  'iceland-northern-lights',
  'Reykjavik',
  'Iceland',
  'Adventure & Nature',
  6,
  5,
  1,
  8,
  'Experience the magic of Iceland with this winter adventure featuring the Northern Lights, ice caves, hot springs, and dramatic landscapes.',
  '["Northern Lights hunting", "Blue Lagoon geothermal spa", "Ice cave exploration", "Golden Circle tour", "Reykjavik city tour", "Airport transfers included"]',
  '[
    {"day": 1, "title": "Arrival in Reykjavik", "description": "Arrive in Iceland and explore the charming capital city", "activities": ["Airport pickup", "Hotel check-in", "Reykjavik walking tour", "Hallgrimskirkja Church visit"]},
    {"day": 2, "title": "Golden Circle Tour", "description": "Discover Iceland most famous natural wonders", "activities": ["Thingvellir National Park", "Geysir geothermal area", "Gullfoss waterfall", "Traditional Icelandic lunch"]},
    {"day": 3, "title": "South Coast Adventure", "description": "Explore black sand beaches and waterfalls", "activities": ["Seljalandsfoss waterfall", "Skogafoss waterfall", "Reynisfjara black sand beach", "Ice cave exploration"]},
    {"day": 4, "title": "Blue Lagoon & Northern Lights", "description": "Relax in geothermal waters and hunt for Aurora", "activities": ["Blue Lagoon geothermal spa", "Silica mud mask", "Northern Lights tour", "Aurora photography"]},
    {"day": 5, "title": "Reykjavik Culture Day", "description": "Immerse in Icelandic culture and cuisine", "activities": ["Harpa Concert Hall", "National Museum", "Local food tour", "Shopping on Laugavegur"]},
    {"day": 6, "title": "Departure", "description": "Final moments in Iceland before departure", "activities": ["Hotel checkout", "Last-minute shopping", "Airport transfer", "Departure"]}
  ]',
  '["Round-trip flights", "5 nights accommodation", "Daily breakfast", "Car rental (4WD)", "Northern Lights tour", "Blue Lagoon entrance", "Golden Circle tour", "Ice cave tour", "Airport transfers", "English-speaking guide"]',
  '["International travel insurance", "Lunch and dinner (except specified)", "Personal expenses", "Optional activities", "Gratuities", "Winter clothing rental"]',
  '["https://images.unsplash.com/photo-1539066776877-3c1e3f8b6158?w=600", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600", "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600"]',
  2899.00,
  2199.00,
  450.00,
  '["2024-11-15", "2024-12-01", "2024-12-15", "2025-01-05", "2025-01-20", "2025-02-10"]',
  14,
  'Moderate cancellation policy - 50% refund up to 30 days before departure',
  'Moderate',
  'Good physical fitness required for ice cave exploration',
  12,
  65,
  2,
  8,
  1,
  'Breakfast included',
  'Premium',
  'active',
  1
),

-- Package 7: Dubai Luxury Experience
(
  'Dubai Luxury Experience',
  'dubai-luxury',
  'Dubai',
  'United Arab Emirates',
  'Luxury & City',
  5,
  4,
  1,
  6,
  'Indulge in the ultimate luxury experience in Dubai with 5-star accommodations, private tours, and exclusive experiences.',
  '["Burj Khalifa Sky Deck", "Desert safari with private camp", "Luxury yacht cruise", "Private shopping tour", "Helicopter tour", "Michelin-starred dining"]',
  '[
    {"day": 1, "title": "Grand Arrival", "description": "Luxury arrival and Dubai Marina exploration", "activities": ["Private airport transfer", "5-star hotel check-in", "Dubai Marina yacht cruise", "Welcome dinner at Atlantis"]},
    {"day": 2, "title": "Modern Dubai Discovery", "description": "Explore futuristic architecture and luxury shopping", "activities": ["Burj Khalifa Sky Deck", "Dubai Mall aquarium", "Private shopping tour", "Gold Souk visit"]},
    {"day": 3, "title": "Desert Adventure", "description": "Luxury desert experience with private camp", "activities": ["Private desert safari", "Camel riding", "Falconry demonstration", "Exclusive Bedouin camp dinner"]},
    {"day": 4, "title": "Cultural & Luxury", "description": "Heritage sites and modern luxury combined", "activities": ["Dubai Museum", "Spice Souk", "Helicopter tour", "Spa treatment at Burj Al Arab"]},
    {"day": 5, "title": "Final Luxury", "description": "Last day of indulgence before departure", "activities": ["Private beach access", "Luxury brunch", "Last-minute shopping", "Private airport transfer"]}
  ]',
  '["Round-trip business class flights", "4 nights 5-star accommodation", "All meals included", "Luxury car with driver", "Private tours and guides", "Burj Khalifa tickets", "Desert safari", "Yacht cruise", "Helicopter tour", "Spa treatments", "Airport transfers"]',
  '["International travel insurance", "Personal shopping expenses", "Alcoholic beverages", "Optional activities", "Gratuities", "Visa fees"]',
  '["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600", "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600", "https://images.unsplash.com/photo-1571417817024-4b2b0b5e6b5b?w=600"]',
  4299.00,
  3299.00,
  750.00,
  '["2024-11-20", "2024-12-05", "2024-12-20", "2025-01-10", "2025-01-25", "2025-02-15"]',
  21,
  'Luxury cancellation policy - 75% refund up to 45 days before departure',
  'Easy',
  'No special physical requirements',
  18,
  70,
  1,
  6,
  1,
  'All meals included',
  'Luxury',
  'active',
  1
),

-- Package 8: Kenya Safari & Beach Combo
(
  'Kenya Safari & Beach Combo',
  'kenya-safari-beach',
  'Nairobi',
  'Kenya',
  'Safari & Beach',
  8,
  7,
  2,
  12,
  'The perfect combination of thrilling wildlife safari in Masai Mara and relaxation on the pristine beaches of Mombasa.',
  '["Big Five safari", "Masai Mara game drives", "Cultural village visit", "Beach resort stay", "Snorkeling excursion", "Sunset dhow cruise"]',
  '[
    {"day": 1, "title": "Nairobi Arrival", "description": "Welcome to Kenya and city orientation", "activities": ["Airport pickup", "Hotel check-in", "Nairobi National Museum", "Welcome dinner with traditional music"]},
    {"day": 2, "title": "Journey to Masai Mara", "description": "Travel to world-famous game reserve", "activities": ["Scenic drive to Masai Mara", "Lodge check-in", "Afternoon game drive", "Sundowner drinks"]},
    {"day": 3, "title": "Full Day Safari", "description": "Comprehensive wildlife viewing experience", "activities": ["Early morning game drive", "Big Five spotting", "Picnic lunch in the bush", "Evening game drive"]},
    {"day": 4, "title": "Masai Culture & Safari", "description": "Cultural immersion and wildlife", "activities": ["Masai village visit", "Traditional dancing", "Afternoon game drive", "Hot air balloon option"]},
    {"day": 5, "title": "Flight to Mombasa", "description": "Transition from safari to beach paradise", "activities": ["Morning game drive", "Flight to Mombasa", "Beach resort check-in", "Sunset on the beach"]},
    {"day": 6, "title": "Beach & Ocean Adventures", "description": "Marine activities and relaxation", "activities": ["Snorkeling excursion", "Dolphin watching", "Beach relaxation", "Seafood dinner"]},
    {"day": 7, "title": "Cultural Coast", "description": "Explore Swahili culture and history", "activities": ["Old Town Mombasa tour", "Fort Jesus visit", "Spice market", "Sunset dhow cruise"]},
    {"day": 8, "title": "Departure", "description": "Final beach moments and departure", "activities": ["Beach leisure time", "Spa treatment", "Airport transfer", "International departure"]}
  ]',
  '["Round-trip flights", "Domestic flights", "7 nights accommodation (safari lodge + beach resort)", "All meals during safari", "Beach resort half-board", "4WD safari vehicle", "Professional safari guide", "Game drives", "Park fees", "Cultural visits", "Airport transfers"]',
  '["International travel insurance", "Visa fees", "Drinks during meals", "Optional hot air balloon", "Personal expenses", "Gratuities", "Travel vaccinations"]',
  '["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600", "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600"]',
  3299.00,
  2499.00,
  550.00,
  '["2024-12-01", "2024-12-15", "2025-01-05", "2025-01-20", "2025-02-10", "2025-02-25"]',
  30,
  'Standard cancellation policy - 25% refund up to 30 days before departure',
  'Moderate',
  'Basic fitness for safari activities',
  8,
  75,
  2,
  12,
  1,
  'Full board safari, half board beach',
  'Premium',
  'active',
  1
),

-- Package 9: Vietnam Cultural Journey
(
  'Vietnam Cultural Journey',
  'vietnam-cultural',
  'Ho Chi Minh City',
  'Vietnam',
  'Culture & Heritage',
  9,
  8,
  2,
  16,
  'Discover the rich culture, history, and cuisine of Vietnam from bustling Ho Chi Minh City to the serene waters of Halong Bay.',
  '["Halong Bay cruise", "Cu Chi Tunnels", "Mekong Delta tour", "Cooking classes", "Traditional markets", "Historical sites"]',
  '[
    {"day": 1, "title": "Ho Chi Minh City Arrival", "description": "Introduction to vibrant Saigon", "activities": ["Airport pickup", "Hotel check-in", "Ben Thanh Market visit", "Street food tour"]},
    {"day": 2, "title": "War History & Cu Chi", "description": "Learn about Vietnam War history", "activities": ["War Remnants Museum", "Cu Chi Tunnels tour", "Traditional lunch", "Reunification Palace"]},
    {"day": 3, "title": "Mekong Delta Adventure", "description": "Explore the river delta region", "activities": ["Mekong Delta boat tour", "Floating markets", "Local village visit", "Traditional crafts workshop"]},
    {"day": 4, "title": "Flight to Hanoi", "description": "Journey to Vietnam capital", "activities": ["Morning cooking class", "Flight to Hanoi", "Old Quarter walking tour", "Water puppet show"]},
    {"day": 5, "title": "Hanoi Discovery", "description": "Explore historical and cultural sites", "activities": ["Ho Chi Minh Mausoleum", "Temple of Literature", "Hoan Kiem Lake", "Cyclo tour"]},
    {"day": 6, "title": "Halong Bay Cruise", "description": "UNESCO World Heritage natural wonder", "activities": ["Drive to Halong Bay", "Luxury cruise boarding", "Kayaking", "Sunset on deck"]},
    {"day": 7, "title": "Halong Bay Exploration", "description": "Island hopping and cave exploration", "activities": ["Sung Sot Cave visit", "Ti Top Island", "Swimming", "Tai Chi on deck"]},
    {"day": 8, "title": "Return to Hanoi", "description": "Final cultural experiences", "activities": ["Cruise disembarkation", "Bat Trang pottery village", "Hanoi food tour", "Night market"]},
    {"day": 9, "title": "Departure", "description": "Farewell to Vietnam", "activities": ["Last-minute shopping", "Vietnamese massage", "Airport transfer", "International departure"]}
  ]',
  '["Round-trip flights", "Domestic flights", "8 nights accommodation", "Daily breakfast", "Car with driver", "2-day Halong Bay cruise", "All tours and entrance fees", "English-speaking guides", "Cooking class", "Airport transfers"]',
  '["International travel insurance", "Visa fees", "Lunch and dinner (except on cruise)", "Personal expenses", "Drinks", "Gratuities", "Optional activities"]',
  '["https://images.unsplash.com/photo-1559592413-7cec4d0d2d8e?w=600", "https://images.unsplash.com/photo-1528127269322-539801943592?w=600", "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600"]',
  2199.00,
  1799.00,
  350.00,
  '["2024-11-10", "2024-11-25", "2024-12-10", "2025-01-15", "2025-02-05", "2025-02-20"]',
  21,
  'Flexible cancellation policy - 50% refund up to 21 days before departure',
  'Easy',
  'Moderate walking required',
  16,
  80,
  2,
  16,
  1,
  'Breakfast included',
  'Standard',
  'active',
  0
),

-- Package 10: Peru Machu Picchu Explorer
(
  'Peru Machu Picchu Explorer',
  'peru-machu-picchu',
  'Lima',
  'Peru',
  'Adventure & Heritage',
  7,
  6,
  1,
  10,
  'Journey through ancient Inca civilization with visits to Lima, Sacred Valley, and the iconic Machu Picchu citadel.',
  '["Machu Picchu guided tour", "Sacred Valley exploration", "Inca Trail option", "Lima city tour", "Local markets", "Traditional cuisine"]',
  '[
    {"day": 1, "title": "Lima Arrival", "description": "Introduction to Peru capital", "activities": ["Airport pickup", "Hotel check-in", "Lima city tour", "Barranco district visit"]},
    {"day": 2, "title": "Lima to Cusco", "description": "Journey to ancient Inca capital", "activities": ["Flight to Cusco", "Altitude acclimatization", "San Pedro Market", "Qorikancha temple"]},
    {"day": 3, "title": "Sacred Valley Discovery", "description": "Explore the heart of Inca civilization", "activities": ["Pisac market and ruins", "Traditional lunch", "Ollantaytambo fortress", "Sacred Valley hotel"]},
    {"day": 4, "title": "Machu Picchu Day", "description": "Visit the Lost City of the Incas", "activities": ["Early train to Aguas Calientes", "Machu Picchu guided tour", "Huayna Picchu option", "Return to Cusco"]},
    {"day": 5, "title": "Cusco Exploration", "description": "Discover colonial and Inca heritage", "activities": ["Sacsayhuaman fortress", "Cusco Cathedral", "San Blas neighborhood", "Cooking class"]},
    {"day": 6, "title": "Rainbow Mountain Option", "description": "Adventure to colorful mountain", "activities": ["Optional Rainbow Mountain trek", "Or Cusco free day", "Shopping for souvenirs", "Farewell dinner"]},
    {"day": 7, "title": "Return to Lima", "description": "Final day and departure", "activities": ["Flight to Lima", "Last-minute shopping", "Airport transfer", "International departure"]}
  ]',
  '["Round-trip flights", "Domestic flights", "6 nights accommodation", "Daily breakfast", "Private transportation", "Train to Machu Picchu", "Machu Picchu entrance and guide", "Sacred Valley tour", "All transfers", "English-speaking guides"]',
  '["International travel insurance", "Lunch and dinner (except specified)", "Huayna Picchu entrance", "Rainbow Mountain trek", "Personal expenses", "Gratuities", "Travel insurance"]',
  '["https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600", "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600", "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?w=600"]',
  2799.00,
  2199.00,
  450.00,
  '["2024-11-05", "2024-11-20", "2024-12-05", "2025-01-10", "2025-01-25", "2025-02-15"]',
  30,
  'Standard cancellation policy - 25% refund up to 30 days before departure',
  'Moderate',
  'Good fitness for altitude and walking',
  12,
  70,
  1,
  10,
  1,
  'Breakfast included',
  'Standard',
  'active',
  1
); 