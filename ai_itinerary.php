<?php
/**
 * ===================================================================
 * AeroTrav AI Itinerary Generator
 * Generates travel itineraries based on user preferences
 * ===================================================================
 */

// Enable error reporting and include database connection
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once 'includes/db_connection.php';

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse([
        'success' => false,
        'message' => 'Only POST method allowed'
    ], 405);
}

try {
    // Get JSON input from request body
    $input = getJsonInput();
    
    if (!$input) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid JSON input'
        ], 400);
    }
    
    // Validate required fields
    $required = ['destination', 'budget', 'duration'];
    $missing = validateRequired($required, $input);
    
    if (!empty($missing)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Missing required fields: ' . implode(', ', $missing)
        ], 400);
    }
    
    // Extract preferences
    $destination = trim($input['destination']);
    $budget = (float)$input['budget'];
    $duration = (int)$input['duration'];
    $interests = $input['interests'] ?? [];
    $travelStyle = $input['travel_style'] ?? 'balanced'; // luxury, budget, balanced
    $accommodationType = $input['accommodation_type'] ?? 'hotel';
    $groupSize = (int)($input['group_size'] ?? 1);
    
    // Validate input ranges
    if ($budget <= 0 || $budget > 100000) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Budget must be between 1 and 100,000'
        ], 400);
    }
    
    if ($duration <= 0 || $duration > 30) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Duration must be between 1 and 30 days'
        ], 400);
    }
    
    // Get database connection
    $pdo = DB::get();
    
    // Generate itinerary based on preferences
    $itinerary = generateItinerary($pdo, $destination, $budget, $duration, $interests, $travelStyle, $accommodationType, $groupSize);
    
    // Return the generated itinerary
    sendJsonResponse([
        'success' => true,
        'data' => [
            'itinerary' => $itinerary,
            'preferences' => [
                'destination' => $destination,
                'budget' => $budget,
                'duration' => $duration,
                'interests' => $interests,
                'travel_style' => $travelStyle,
                'accommodation_type' => $accommodationType,
                'group_size' => $groupSize
            ],
            'generated_at' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    // Log any errors
    logError("AI Itinerary error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Error generating itinerary'
    ], 500);
}

/**
 * Generate itinerary based on user preferences
 * This is a simplified AI-like algorithm - in production you'd integrate with actual AI services
 */
function generateItinerary($pdo, $destination, $budget, $duration, $interests, $travelStyle, $accommodationType, $groupSize) {
    
    // Calculate daily budget
    $dailyBudget = $budget / $duration;
    
    // Budget allocation percentages based on travel style
    $budgetAllocation = [
        'luxury' => ['accommodation' => 0.5, 'food' => 0.25, 'activities' => 0.15, 'transport' => 0.1],
        'budget' => ['accommodation' => 0.3, 'food' => 0.2, 'activities' => 0.3, 'transport' => 0.2],
        'balanced' => ['accommodation' => 0.4, 'food' => 0.25, 'activities' => 0.25, 'transport' => 0.1]
    ];
    
    $allocation = $budgetAllocation[$travelStyle] ?? $budgetAllocation['balanced'];
    
    // Get available services for the destination
    $hotels = getHotelsByDestination($pdo, $destination, $dailyBudget * $allocation['accommodation']);
    $packages = getPackagesByDestination($pdo, $destination, $budget);
    $activities = generateActivitiesByInterests($interests, $destination);
    
    // Generate day-by-day itinerary
    $itinerary = [
        'destination' => $destination,
        'total_budget' => $budget,
        'duration_days' => $duration,
        'daily_budget' => $dailyBudget,
        'budget_breakdown' => [
            'accommodation' => $dailyBudget * $allocation['accommodation'] * $duration,
            'food' => $dailyBudget * $allocation['food'] * $duration,
            'activities' => $dailyBudget * $allocation['activities'] * $duration,
            'transport' => $dailyBudget * $allocation['transport'] * $duration
        ],
        'recommended_hotels' => array_slice($hotels, 0, 3),
        'recommended_packages' => array_slice($packages, 0, 2),
        'daily_schedule' => []
    ];
    
    // Generate daily schedule
    for ($day = 1; $day <= $duration; $day++) {
        $daySchedule = generateDaySchedule($day, $duration, $activities, $dailyBudget, $allocation, $interests);
        $itinerary['daily_schedule'][] = $daySchedule;
    }
    
    // Calculate estimated costs
    $itinerary['estimated_total_cost'] = calculateEstimatedCost($itinerary);
    
    return $itinerary;
}

/**
 * Get hotels by destination within budget
 */
function getHotelsByDestination($pdo, $destination, $maxDailyRate) {
    try {
        $sql = "SELECT * FROM hotels 
                WHERE destination LIKE ? 
                AND price_per_night <= ? 
                AND status = 'active' 
                ORDER BY rating DESC, price_per_night ASC 
                LIMIT 5";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['%' . $destination . '%', $maxDailyRate]);
        
        $hotels = [];
        while ($row = $stmt->fetch()) {
            $hotels[] = [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'location' => $row['location'],
                'price_per_night' => (float)$row['price_per_night'],
                'rating' => (float)$row['rating'],
                'amenities' => json_decode($row['amenities'], true) ?: []
            ];
        }
        
        return $hotels;
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Get packages by destination within budget
 */
function getPackagesByDestination($pdo, $destination, $maxBudget) {
    try {
        $sql = "SELECT * FROM packages 
                WHERE destination LIKE ? 
                AND price <= ? 
                AND status = 'active' 
                ORDER BY price ASC 
                LIMIT 3";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['%' . $destination . '%', $maxBudget]);
        
        $packages = [];
        while ($row = $stmt->fetch()) {
            $packages[] = [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'duration_days' => (int)$row['duration_days'],
                'price' => (float)$row['price'],
                'includes' => json_decode($row['includes'], true) ?: [],
                'difficulty_level' => $row['difficulty_level']
            ];
        }
        
        return $packages;
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Generate activities based on interests
 */
function generateActivitiesByInterests($interests, $destination) {
    $activityDatabase = [
        'culture' => ['Visit Museums', 'Historical Tours', 'Art Galleries', 'Local Markets'],
        'adventure' => ['Hiking', 'Rock Climbing', 'Water Sports', 'Zip Lining'],
        'relaxation' => ['Spa Visits', 'Beach Time', 'Sunset Views', 'Yoga Classes'],
        'food' => ['Food Tours', 'Cooking Classes', 'Local Restaurants', 'Street Food'],
        'nature' => ['National Parks', 'Wildlife Watching', 'Botanical Gardens', 'Scenic Drives'],
        'nightlife' => ['Bars and Clubs', 'Live Music', 'Night Markets', 'Evening Cruises']
    ];
    
    $activities = [];
    
    foreach ($interests as $interest) {
        if (isset($activityDatabase[strtolower($interest)])) {
            $activities = array_merge($activities, $activityDatabase[strtolower($interest)]);
        }
    }
    
    // Add generic activities if no specific interests
    if (empty($activities)) {
        $activities = ['Sightseeing', 'Local Exploration', 'Photography', 'Shopping'];
    }
    
    return array_unique($activities);
}

/**
 * Generate schedule for a specific day
 */
function generateDaySchedule($day, $totalDays, $activities, $dailyBudget, $allocation, $interests) {
    $schedule = [
        'day' => $day,
        'date' => date('Y-m-d', strtotime("+$day days")),
        'morning' => [],
        'afternoon' => [],
        'evening' => [],
        'estimated_cost' => $dailyBudget
    ];
    
    // First and last day special handling
    if ($day == 1) {
        $schedule['morning'][] = ['activity' => 'Arrival and Check-in', 'duration' => '2-3 hours', 'cost' => 0];
        $schedule['afternoon'][] = ['activity' => 'City Orientation Walk', 'duration' => '2 hours', 'cost' => 0];
        $schedule['evening'][] = ['activity' => 'Welcome Dinner', 'duration' => '2 hours', 'cost' => $dailyBudget * 0.3];
    } else if ($day == $totalDays) {
        $schedule['morning'][] = ['activity' => 'Last Minute Shopping', 'duration' => '2 hours', 'cost' => $dailyBudget * 0.2];
        $schedule['afternoon'][] = ['activity' => 'Check-out and Departure', 'duration' => '2-3 hours', 'cost' => 0];
    } else {
        // Regular day activities
        $dayActivities = array_slice($activities, ($day - 2) % count($activities), 3);
        
        $schedule['morning'][] = [
            'activity' => $dayActivities[0] ?? 'Free Time', 
            'duration' => '3 hours', 
            'cost' => $dailyBudget * 0.2
        ];
        
        $schedule['afternoon'][] = [
            'activity' => $dayActivities[1] ?? 'Local Exploration', 
            'duration' => '4 hours', 
            'cost' => $dailyBudget * 0.3
        ];
        
        $schedule['evening'][] = [
            'activity' => $dayActivities[2] ?? 'Dinner and Rest', 
            'duration' => '2 hours', 
            'cost' => $dailyBudget * 0.25
        ];
    }
    
    return $schedule;
}

/**
 * Calculate estimated total cost
 */
function calculateEstimatedCost($itinerary) {
    $total = 0;
    
    foreach ($itinerary['daily_schedule'] as $day) {
        $total += $day['estimated_cost'];
    }
    
    return $total;
}
?> 