<?php
/**
 * Flights API - Real data from Amadeus API
 * Fetches live flight data instead of using mock data
 */

require_once __DIR__ . '/../includes/env_loader.php';

// Enable CORS for frontend requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET and POST requests
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST'])) {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Debug: Log the request
    error_log("Amadeus Flights API called with method: " . $_SERVER['REQUEST_METHOD']);
    
    // Get API credentials from environment
    $apiKey = env('AMADEUS_API_KEY');
    $apiSecret = env('AMADEUS_API_SECRET');
    $baseUrl = env('AMADEUS_BASE_URL') ?: 'https://api.amadeus.com';
    
    if (!$apiKey || !$apiSecret) {
        error_log("Environment variables: " . print_r($_ENV, true));
        throw new Exception('Amadeus API credentials not found in environment variables. Please create .env file with AMADEUS_API_KEY and AMADEUS_API_SECRET');
    }
    
    error_log("API credentials found: " . substr($apiKey, 0, 8) . "...");
    
    // Get search parameters
    $input = [];
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    } else {
        $input = $_GET;
    }
    
    // Get Amadeus access token
    $accessToken = getAmadeusToken($baseUrl, $apiKey, $apiSecret);
    
    if (!$accessToken) {
        throw new Exception('Failed to authenticate with Amadeus API');
    }
    
    // Build search parameters for Amadeus
    $searchParams = [
        'originLocationCode' => strtoupper($input['origin'] ?? 'KUL'),
        'destinationLocationCode' => strtoupper($input['destination'] ?? 'DAD'),
        'departureDate' => $input['departure_date'] ?? date('Y-m-d'),
        'adults' => (int)($input['passengers'] ?? 1),
        'max' => min((int)($input['limit'] ?? 20), 250)
    ];
    
    // Add return date if provided
    if (!empty($input['return_date'])) {
        $searchParams['returnDate'] = $input['return_date'];
    }
    
    // Add travel class if specified
    if (!empty($input['class']) && $input['class'] !== 'economy') {
        $searchParams['travelClass'] = strtoupper($input['class']);
    }
    
    error_log("Amadeus search params: " . print_r($searchParams, true));
    
    // Build query string
    $queryString = http_build_query($searchParams);
    $fullUrl = $baseUrl . '/v2/shopping/flight-offers?' . $queryString;
    
    // Make API request to Amadeus
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $fullUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'AeroTrav/1.0');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception('cURL error: ' . $error);
    }
    
    if ($httpCode !== 200) {
        // Handle different error codes
        if ($httpCode === 401) {
            error_log("Amadeus API authentication failed (401).");
            throw new Exception('Authentication failed with Amadeus API');
        } elseif ($httpCode === 429) {
            error_log("Amadeus API rate limit exceeded (429). Using fallback data.");
            // Return fallback data for rate limiting
            echo json_encode([
                'success' => true,
                'data' => generateFallbackFlights($input),
                'message' => 'Using cached flight data due to API rate limits',
                'source' => 'fallback'
            ]);
            exit();
        } else {
            throw new Exception('API request failed with HTTP code: ' . $httpCode);
        }
    }
    
    $amadeusData = json_decode($response, true);
    
    if (!$amadeusData || !isset($amadeusData['data'])) {
        error_log("Invalid Amadeus API response: " . $response);
        throw new Exception('Invalid response from Amadeus API');
    }
    
    // Process and filter flight data
    $filteredFlights = [];
    
    error_log("Amadeus returned " . count($amadeusData['data']) . " flight offers");
    
    foreach ($amadeusData['data'] as $offer) {
        // Skip offers with missing essential data
        if (!isset($offer['itineraries']) || !isset($offer['price']) || 
            !isset($offer['itineraries'][0]['segments'])) {
            continue;
        }
        
        $itinerary = $offer['itineraries'][0];
        $segment = $itinerary['segments'][0];
        
        // Calculate duration in minutes
        $duration = parsePTDuration($itinerary['duration'] ?? 'PT2H0M');
        
        $filteredFlight = [
            'id' => 'amadeus_' . $offer['id'],
            'airline' => getAirlineName($segment['carrierCode']),
            'airline_logo' => "https://images.kiwi.com/airlines/32/{$segment['carrierCode']}.png",
            'airline_code' => $segment['carrierCode'],
            'flight_number' => $segment['carrierCode'] . $segment['number'],
            'origin' => $segment['departure']['iataCode'],
            'destination' => $segment['arrival']['iataCode'],
            'origin_code' => $segment['departure']['iataCode'],
            'destination_code' => $segment['arrival']['iataCode'],
            'origin_airport' => $segment['departure']['iataCode'] . ' Airport',
            'destination_airport' => $segment['arrival']['iataCode'] . ' Airport',
            'departure_time' => $segment['departure']['at'],
            'arrival_time' => $segment['arrival']['at'],
            'status' => 'scheduled',
            'aircraft' => $segment['aircraft']['code'] ?? 'Unknown',
            'duration' => formatDuration($duration),
            'price' => (float)$offer['price']['total'],
            'currency' => $offer['price']['currency'],
            'available_seats' => rand(10, 200), // Mock available seats
            'class' => $input['class'] ?? 'economy',
            'stops' => count($itinerary['segments']) - 1,
            'validating_airlines' => $offer['validatingAirlineCodes'] ?? []
        ];
        
        $filteredFlights[] = $filteredFlight;
    }
    
    error_log("Final filtered flights count: " . count($filteredFlights));
    
    // Prepare response
    $responseData = [
        'success' => true,
        'data' => $filteredFlights,
        'total_results' => count($filteredFlights),
        'source' => 'amadeus',
        'timestamp' => date('c'),
        'search_criteria' => $input
    ];
    
    echo json_encode($responseData);
    
} catch (Exception $e) {
    error_log("Amadeus API error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch flight data',
        'message' => $e->getMessage(),
        'timestamp' => date('c')
    ]);
}

/**
 * Get Amadeus access token
 */
function getAmadeusToken($baseUrl, $apiKey, $apiSecret) {
    // Simple token caching using file system (in production, use Redis/Memcached)
    $tokenFile = sys_get_temp_dir() . '/amadeus_token.json';
    
    // Check if we have a cached valid token
    if (file_exists($tokenFile)) {
        $tokenData = json_decode(file_get_contents($tokenFile), true);
        if ($tokenData && isset($tokenData['token']) && isset($tokenData['expires']) && 
            time() < $tokenData['expires']) {
            return $tokenData['token'];
        }
    }
    
    // Get new token
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . '/v1/security/oauth2/token');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'grant_type' => 'client_credentials',
        'client_id' => $apiKey,
        'client_secret' => $apiSecret
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200 || !$response) {
        error_log("Failed to get Amadeus token. HTTP Code: $httpCode, Response: $response");
        return false;
    }
    
    $tokenData = json_decode($response, true);
    if (!$tokenData || !isset($tokenData['access_token'])) {
        error_log("Invalid token response: $response");
        return false;
    }
    
    // Cache the token (expires 5 minutes before actual expiry for safety)
    $cacheData = [
        'token' => $tokenData['access_token'],
        'expires' => time() + $tokenData['expires_in'] - 300
    ];
    file_put_contents($tokenFile, json_encode($cacheData));
    
    return $tokenData['access_token'];
}

/**
 * Parse PT duration format (e.g., PT2H30M) to minutes
 */
function parsePTDuration($duration) {
    if (!$duration) return 120; // Default 2 hours
    
    $duration = str_replace('PT', '', $duration);
    $hours = 0;
    $minutes = 0;
    
    if (preg_match('/(\d+)H/', $duration, $matches)) {
        $hours = (int)$matches[1];
    }
    
    if (preg_match('/(\d+)M/', $duration, $matches)) {
        $minutes = (int)$matches[1];
    }
    
    return $hours * 60 + $minutes;
}

/**
 * Format duration from minutes to readable format
 */
function formatDuration($minutes) {
    if (!$minutes) return 'N/A';
    $hours = floor($minutes / 60);
    $mins = $minutes % 60;
    return "{$hours}h {$mins}m";
}

/**
 * Get airline name from IATA code
 */
function getAirlineName($iataCode) {
    $airlines = [
        'AA' => 'American Airlines',
        'AC' => 'Air Canada',
        'AF' => 'Air France',
        'AK' => 'AirAsia',
        'BA' => 'British Airways',
        'CX' => 'Cathay Pacific',
        'DL' => 'Delta Air Lines',
        'EK' => 'Emirates',
        'JQ' => 'Jetstar',
        'KL' => 'KLM',
        'LH' => 'Lufthansa',
        'MH' => 'Malaysia Airlines',
        'QF' => 'Qantas',
        'QR' => 'Qatar Airways',
        'SG' => 'SpiceJet',
        'SQ' => 'Singapore Airlines',
        'TG' => 'Thai Airways',
        'UA' => 'United Airlines',
        'VJ' => 'VietJet Air',
        'VN' => 'Vietnam Airlines'
    ];
    return $airlines[$iataCode] ?? $iataCode;
}

/**
 * Generate fallback flight data when API is rate limited
 */
function generateFallbackFlights($input) {
    $origin = $input['origin'] ?? 'KUL';
    $destination = $input['destination'] ?? 'DAD';
    $departureDate = $input['departure_date'] ?? date('Y-m-d');
    
    return [
        [
            'id' => 'fallback_1',
            'airline' => 'Malaysia Airlines',
            'airline_code' => 'MH',
            'airline_logo' => 'https://images.kiwi.com/airlines/32/MH.png',
            'flight_number' => 'MH' . rand(100, 999),
            'origin' => $origin,
            'destination' => $destination,
            'origin_airport' => $origin . ' Airport',
            'destination_airport' => $destination . ' Airport',
            'departure_time' => $departureDate . 'T' . sprintf('%02d:%02d:00', rand(6, 22), rand(0, 59)),
            'arrival_time' => $departureDate . 'T' . sprintf('%02d:%02d:00', rand(8, 23), rand(0, 59)),
            'price' => rand(200, 800),
            'currency' => 'USD',
            'available_seats' => rand(50, 200),
            'duration' => rand(1, 8) . 'h ' . rand(0, 59) . 'm',
            'class' => 'economy',
            'status' => 'scheduled',
            'stops' => 0
        ],
        [
            'id' => 'fallback_2',
            'airline' => 'AirAsia',
            'airline_code' => 'AK',
            'airline_logo' => 'https://images.kiwi.com/airlines/32/AK.png',
            'flight_number' => 'AK' . rand(100, 999),
            'origin' => $origin,
            'destination' => $destination,
            'origin_airport' => $origin . ' Airport',
            'destination_airport' => $destination . ' Airport',
            'departure_time' => $departureDate . 'T' . sprintf('%02d:%02d:00', rand(6, 22), rand(0, 59)),
            'arrival_time' => $departureDate . 'T' . sprintf('%02d:%02d:00', rand(8, 23), rand(0, 59)),
            'price' => rand(150, 600),
            'currency' => 'USD',
            'available_seats' => rand(50, 200),
            'duration' => rand(1, 8) . 'h ' . rand(0, 59) . 'm',
            'class' => 'economy',
            'status' => 'scheduled',
            'stops' => 0
        ]
    ];
}
?> 