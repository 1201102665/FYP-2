<?php
/**
 * Hotel Search API Endpoint
 * Handles hotel search requests with comprehensive filtering and room availability
 */

require_once '../../includes/enhanced_db_connection.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

try {
    $db = getDB();
    $userId = getCurrentUserId();
    $sessionId = generateSessionId();
    
    // Get and validate input
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    
    // Required fields
    $requiredFields = ['destination', 'check_in', 'check_out'];
    $errors = validateRequired($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Missing required fields', 'details' => $errors], 400);
    }
    
    // Build search criteria
    $criteria = [
        'city' => sanitizeInput($input['destination']),
        'check_in' => sanitizeInput($input['check_in']),
        'check_out' => sanitizeInput($input['check_out']),
        'rooms' => isset($input['rooms']) ? (int)$input['rooms'] : 1,
        'adults' => isset($input['adults']) ? (int)$input['adults'] : 2,
        'children' => isset($input['children']) ? (int)$input['children'] : 0,
        'category' => isset($input['category']) ? sanitizeInput($input['category']) : null,
        'min_rating' => isset($input['min_rating']) ? (float)$input['min_rating'] : null
    ];
    
    // Validate dates
    $checkIn = DateTime::createFromFormat('Y-m-d', $criteria['check_in']);
    $checkOut = DateTime::createFromFormat('Y-m-d', $criteria['check_out']);
    
    if (!$checkIn || !$checkOut) {
        sendJsonResponse(['error' => 'Invalid date format. Use YYYY-MM-DD'], 400);
    }
    
    if ($checkOut <= $checkIn) {
        sendJsonResponse(['error' => 'Check-out date must be after check-in date'], 400);
    }
    
    if ($checkIn < new DateTime('today')) {
        sendJsonResponse(['error' => 'Check-in date cannot be in the past'], 400);
    }
    
    // Calculate number of nights
    $nights = $checkIn->diff($checkOut)->days;
    
    // Validate room and guest counts
    if ($criteria['rooms'] < 1 || $criteria['rooms'] > 10) {
        sendJsonResponse(['error' => 'Rooms must be between 1 and 10'], 400);
    }
    
    if ($criteria['adults'] < 1 || $criteria['adults'] > 20) {
        sendJsonResponse(['error' => 'Adults must be between 1 and 20'], 400);
    }
    
    if ($criteria['children'] < 0 || $criteria['children'] > 10) {
        sendJsonResponse(['error' => 'Children must be between 0 and 10'], 400);
    }
    
    // Search for hotels
    $hotels = $db->searchHotels($criteria);
    
    // Get room details for each hotel
    $hotelResults = [];
    foreach ($hotels as $hotel) {
        $hotelData = processHotel($hotel, $criteria, $nights);
        if ($hotelData) {
            $hotelResults[] = $hotelData;
        }
    }
    
    // Apply additional filters if provided
    if (isset($input['filters'])) {
        $hotelResults = applyHotelFilters($hotelResults, $input['filters']);
    }
    
    // Sort results
    $sortBy = $input['sort_by'] ?? 'rating_desc';
    $hotelResults = sortHotels($hotelResults, $sortBy);
    
    // Apply pagination
    $page = isset($input['page']) ? (int)$input['page'] : 1;
    $perPage = isset($input['per_page']) ? (int)$input['per_page'] : 20;
    $perPage = min($perPage, 50); // Max 50 results per page
    
    $totalResults = count($hotelResults);
    $totalPages = ceil($totalResults / $perPage);
    $offset = ($page - 1) * $perPage;
    $paginatedResults = array_slice($hotelResults, $offset, $perPage);
    
    // Log search activity
    $searchData = [
        'search_type' => 'hotels',
        'search_query' => $criteria,
        'filters_applied' => $input['filters'] ?? [],
        'results_count' => $totalResults
    ];
    $db->logSearchActivity($userId, $sessionId, $searchData);
    
    // Prepare response
    $response = [
        'success' => true,
        'search_criteria' => $criteria,
        'hotels' => $paginatedResults,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total_results' => $totalResults,
            'total_pages' => $totalPages,
            'has_next_page' => $page < $totalPages,
            'has_prev_page' => $page > 1
        ],
        'search_id' => uniqid('search_'),
        'nights' => $nights,
        'timestamp' => date('c')
    ];
    
    sendJsonResponse($response);
    
} catch (Exception $e) {
    error_log("Hotel search error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Hotel search failed. Please try again.'], 500);
}

/**
 * Process hotel data and get available rooms
 */
function processHotel($hotel, $criteria, $nights) {
    $db = getDB();
    
    // Get available rooms for this hotel
    $roomSql = "SELECT hr.*, 
                       (hr.total_rooms - COALESCE(booked_rooms.booked_count, 0)) as available_count
                FROM hotel_rooms hr
                LEFT JOIN (
                    SELECT room_id, SUM(rooms_count) as booked_count
                    FROM hotel_bookings hb
                    JOIN booking_items bi ON hb.booking_item_id = bi.id
                    JOIN bookings b ON bi.booking_id = b.id
                    WHERE b.status IN ('confirmed', 'pending')
                    AND NOT (hb.check_out_date <= :check_in OR hb.check_in_date >= :check_out)
                    GROUP BY room_id
                ) as booked_rooms ON hr.id = booked_rooms.room_id
                WHERE hr.hotel_id = :hotel_id
                AND (hr.total_rooms - COALESCE(booked_rooms.booked_count, 0)) >= :rooms_needed
                AND hr.max_occupancy >= :total_guests";
    
    $stmt = $db->getPDO()->prepare($roomSql);
    $stmt->execute([
        ':hotel_id' => $hotel['id'],
        ':check_in' => $criteria['check_in'],
        ':check_out' => $criteria['check_out'],
        ':rooms_needed' => $criteria['rooms'],
        ':total_guests' => $criteria['adults'] + $criteria['children']
    ]);
    
    $availableRooms = $stmt->fetchAll();
    
    // If no rooms available, skip this hotel
    if (empty($availableRooms)) {
        return null;
    }
    
    // Process rooms and calculate pricing
    $processedRooms = [];
    $minPrice = PHP_FLOAT_MAX;
    
    foreach ($availableRooms as $room) {
        $totalPrice = $room['base_price'] * $nights * $criteria['rooms'];
        $minPrice = min($minPrice, $totalPrice);
        
        $processedRooms[] = [
            'id' => $room['id'],
            'room_type' => $room['room_type'],
            'description' => $room['description'],
            'max_occupancy' => $room['max_occupancy'],
            'size_sqm' => $room['size_sqm'],
            'bed_type' => $room['bed_type'],
            'amenities' => json_decode($room['amenities'], true),
            'images' => json_decode($room['images'], true),
            'base_price_per_night' => (float)$room['base_price'],
            'total_price' => $totalPrice,
            'available_rooms' => $room['available_count'],
            'rooms_needed' => $criteria['rooms']
        ];
    }
    
    // Sort rooms by price
    usort($processedRooms, function($a, $b) {
        return $a['total_price'] <=> $b['total_price'];
    });
    
    return [
        'id' => $hotel['id'],
        'name' => $hotel['name'],
        'chain' => $hotel['chain'],
        'category' => $hotel['category'],
        'star_rating' => (float)$hotel['star_rating'],
        'user_rating' => isset($hotel['avg_rating']) ? round((float)$hotel['avg_rating'], 2) : null,
        'review_count' => (int)($hotel['review_count'] ?? 0),
        'address' => $hotel['address'],
        'city' => $hotel['city'],
        'country' => $hotel['country'],
        'latitude' => $hotel['latitude'] ? (float)$hotel['latitude'] : null,
        'longitude' => $hotel['longitude'] ? (float)$hotel['longitude'] : null,
        'description' => $hotel['description'],
        'amenities' => json_decode($hotel['amenities'], true),
        'images' => json_decode($hotel['images'], true),
        'check_in_time' => $hotel['check_in_time'],
        'check_out_time' => $hotel['check_out_time'],
        'cancellation_policy' => $hotel['cancellation_policy'],
        'contact_email' => $hotel['contact_email'],
        'contact_phone' => $hotel['contact_phone'],
        'website' => $hotel['website'],
        'available_rooms' => $processedRooms,
        'min_price_total' => $minPrice,
        'min_price_per_night' => $minPrice / $nights,
        'nights' => $nights,
        'distance_from_center' => null // Could be calculated if city center coordinates available
    ];
}

/**
 * Apply additional filters to hotel results
 */
function applyHotelFilters($hotels, $filters) {
    $filtered = $hotels;
    
    // Price range filter
    if (isset($filters['min_price'])) {
        $filtered = array_filter($filtered, function($hotel) use ($filters) {
            return $hotel['min_price_total'] >= (float)$filters['min_price'];
        });
    }
    
    if (isset($filters['max_price'])) {
        $filtered = array_filter($filtered, function($hotel) use ($filters) {
            return $hotel['min_price_total'] <= (float)$filters['max_price'];
        });
    }
    
    // Star rating filter
    if (isset($filters['min_star_rating'])) {
        $filtered = array_filter($filtered, function($hotel) use ($filters) {
            return $hotel['star_rating'] >= (float)$filters['min_star_rating'];
        });
    }
    
    // User rating filter
    if (isset($filters['min_user_rating'])) {
        $filtered = array_filter($filtered, function($hotel) use ($filters) {
            return $hotel['user_rating'] && $hotel['user_rating'] >= (float)$filters['min_user_rating'];
        });
    }
    
    // Category filter
    if (isset($filters['categories']) && is_array($filters['categories'])) {
        $filtered = array_filter($filtered, function($hotel) use ($filters) {
            return in_array($hotel['category'], $filters['categories']);
        });
    }
    
    // Chain filter
    if (isset($filters['chains']) && is_array($filters['chains'])) {
        $filtered = array_filter($filtered, function($hotel) use ($filters) {
            return in_array($hotel['chain'], $filters['chains']);
        });
    }
    
    // Amenities filter
    if (isset($filters['amenities']) && is_array($filters['amenities'])) {
        $filtered = array_filter($filtered, function($hotel) use ($filters) {
            $hotelAmenities = $hotel['amenities'] ?: [];
            foreach ($filters['amenities'] as $requiredAmenity) {
                if (!in_array($requiredAmenity, $hotelAmenities)) {
                    return false;
                }
            }
            return true;
        });
    }
    
    // Distance filter (if coordinates available)
    if (isset($filters['max_distance_km']) && isset($filters['center_lat']) && isset($filters['center_lng'])) {
        $filtered = array_filter($filtered, function($hotel) use ($filters) {
            if (!$hotel['latitude'] || !$hotel['longitude']) {
                return true; // Include hotels without coordinates
            }
            
            $distance = calculateDistance(
                $filters['center_lat'],
                $filters['center_lng'],
                $hotel['latitude'],
                $hotel['longitude']
            );
            
            return $distance <= (float)$filters['max_distance_km'];
        });
    }
    
    return array_values($filtered);
}

/**
 * Sort hotels by specified criteria
 */
function sortHotels($hotels, $sortBy) {
    switch ($sortBy) {
        case 'price_asc':
            usort($hotels, function($a, $b) {
                return $a['min_price_total'] <=> $b['min_price_total'];
            });
            break;
        case 'price_desc':
            usort($hotels, function($a, $b) {
                return $b['min_price_total'] <=> $a['min_price_total'];
            });
            break;
        case 'rating_desc':
            usort($hotels, function($a, $b) {
                $aRating = $a['user_rating'] ?: 0;
                $bRating = $b['user_rating'] ?: 0;
                if ($aRating === $bRating) {
                    return $b['star_rating'] <=> $a['star_rating'];
                }
                return $bRating <=> $aRating;
            });
            break;
        case 'rating_asc':
            usort($hotels, function($a, $b) {
                $aRating = $a['user_rating'] ?: 0;
                $bRating = $b['user_rating'] ?: 0;
                if ($aRating === $bRating) {
                    return $a['star_rating'] <=> $b['star_rating'];
                }
                return $aRating <=> $bRating;
            });
            break;
        case 'star_rating_desc':
            usort($hotels, function($a, $b) {
                return $b['star_rating'] <=> $a['star_rating'];
            });
            break;
        case 'name_asc':
            usort($hotels, function($a, $b) {
                return strcasecmp($a['name'], $b['name']);
            });
            break;
        case 'distance_asc':
            // Would sort by distance if calculated
            break;
        default:
            // Default: rating desc
            usort($hotels, function($a, $b) {
                $aRating = $a['user_rating'] ?: 0;
                $bRating = $b['user_rating'] ?: 0;
                if ($aRating === $bRating) {
                    return $b['star_rating'] <=> $a['star_rating'];
                }
                return $bRating <=> $aRating;
            });
            break;
    }
    
    return $hotels;
}

/**
 * Calculate distance between two coordinates in kilometers
 */
function calculateDistance($lat1, $lng1, $lat2, $lng2) {
    $earthRadius = 6371; // Earth's radius in kilometers
    
    $lat1Rad = deg2rad($lat1);
    $lng1Rad = deg2rad($lng1);
    $lat2Rad = deg2rad($lat2);
    $lng2Rad = deg2rad($lng2);
    
    $latDiff = $lat2Rad - $lat1Rad;
    $lngDiff = $lng2Rad - $lng1Rad;
    
    $a = sin($latDiff / 2) * sin($latDiff / 2) +
         cos($lat1Rad) * cos($lat2Rad) *
         sin($lngDiff / 2) * sin($lngDiff / 2);
    
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    
    return $earthRadius * $c;
}
?> 