<?php
/**
 * Travel Packages Search API Endpoint
 * Handles package search with comprehensive filtering
 */

require_once '../../includes/enhanced_db_connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

try {
    $db = getDB();
    $userId = getCurrentUserId();
    $sessionId = generateSessionId();
    
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    
    $criteria = [
        'destination' => isset($input['destination']) ? sanitizeInput($input['destination']) : null,
        'category' => isset($input['category']) ? sanitizeInput($input['category']) : null,
        'duration_min' => isset($input['duration_min']) ? (int)$input['duration_min'] : null,
        'duration_max' => isset($input['duration_max']) ? (int)$input['duration_max'] : null,
        'min_price' => isset($input['min_price']) ? (float)$input['min_price'] : null,
        'max_price' => isset($input['max_price']) ? (float)$input['max_price'] : null,
        'start_date' => isset($input['start_date']) ? sanitizeInput($input['start_date']) : null,
        'travelers' => isset($input['travelers']) ? (int)$input['travelers'] : 1
    ];
    
    // Validate travelers count
    if ($criteria['travelers'] < 1 || $criteria['travelers'] > 20) {
        sendJsonResponse(['error' => 'Travelers must be between 1 and 20'], 400);
    }
    
    // Validate date if provided
    if ($criteria['start_date']) {
        $startDate = DateTime::createFromFormat('Y-m-d', $criteria['start_date']);
        if (!$startDate) {
            sendJsonResponse(['error' => 'Invalid start_date format. Use YYYY-MM-DD'], 400);
        }
        if ($startDate < new DateTime('today')) {
            sendJsonResponse(['error' => 'Start date cannot be in the past'], 400);
        }
    }
    
    // Search packages
    $packages = $db->searchPackages($criteria);
    
    // Process packages
    $packageResults = [];
    foreach ($packages as $package) {
        $packageData = processPackage($package, $criteria);
        if ($packageData) {
            $packageResults[] = $packageData;
        }
    }
    
    // Apply additional filters
    if (isset($input['filters'])) {
        $packageResults = applyPackageFilters($packageResults, $input['filters']);
    }
    
    // Sort results
    $sortBy = $input['sort_by'] ?? 'featured_first';
    $packageResults = sortPackages($packageResults, $sortBy);
    
    // Apply pagination
    $page = isset($input['page']) ? (int)$input['page'] : 1;
    $perPage = isset($input['per_page']) ? (int)$input['per_page'] : 20;
    $perPage = min($perPage, 50);
    
    $totalResults = count($packageResults);
    $totalPages = ceil($totalResults / $perPage);
    $offset = ($page - 1) * $perPage;
    $paginatedResults = array_slice($packageResults, $offset, $perPage);
    
    // Log search
    $searchData = [
        'search_type' => 'packages',
        'search_query' => $criteria,
        'filters_applied' => $input['filters'] ?? [],
        'results_count' => $totalResults
    ];
    $db->logSearchActivity($userId, $sessionId, $searchData);
    
    sendJsonResponse([
        'success' => true,
        'search_criteria' => $criteria,
        'packages' => $paginatedResults,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total_results' => $totalResults,
            'total_pages' => $totalPages,
            'has_next_page' => $page < $totalPages,
            'has_prev_page' => $page > 1
        ],
        'search_id' => uniqid('search_'),
        'timestamp' => date('c')
    ]);
    
} catch (Exception $e) {
    error_log("Package search error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Package search failed. Please try again.'], 500);
}

function processPackage($package, $criteria) {
    // Check traveler capacity
    if ($criteria['travelers'] > $package['max_travelers']) {
        return null;
    }
    
    // Calculate pricing
    $basePrice = (float)$package['base_price'];
    $childPrice = $package['child_price'] ? (float)$package['child_price'] : $basePrice * 0.7;
    $singleSupplement = $package['single_supplement'] ? (float)$package['single_supplement'] : 0;
    
    // For simplicity, assume all travelers are adults
    $totalPrice = $basePrice * $criteria['travelers'];
    
    // Check available dates
    $availableDates = json_decode($package['available_dates'], true) ?: [];
    $isAvailable = empty($availableDates) || checkDateAvailability($availableDates, $criteria['start_date']);
    
    return [
        'id' => $package['id'],
        'name' => $package['name'],
        'slug' => $package['slug'],
        'destination_city' => $package['destination_city'],
        'destination_country' => $package['destination_country'],
        'category' => $package['category'],
        'duration_days' => $package['duration_days'],
        'duration_nights' => $package['duration_nights'],
        'min_travelers' => $package['min_travelers'],
        'max_travelers' => $package['max_travelers'],
        'description' => $package['description'],
        'highlights' => json_decode($package['highlights'], true),
        'itinerary' => json_decode($package['itinerary'], true),
        'included_items' => json_decode($package['included_items'], true),
        'excluded_items' => json_decode($package['excluded_items'], true),
        'images' => json_decode($package['images'], true),
        'base_price' => $basePrice,
        'child_price' => $childPrice,
        'single_supplement' => $singleSupplement,
        'total_price' => $totalPrice,
        'price_per_person' => $basePrice,
        'available_dates' => $availableDates,
        'is_available' => $isAvailable,
        'booking_deadline_days' => $package['booking_deadline_days'],
        'cancellation_policy' => $package['cancellation_policy'],
        'difficulty_level' => $package['difficulty_level'],
        'physical_requirements' => $package['physical_requirements'],
        'recommended_age_min' => $package['recommended_age_min'],
        'recommended_age_max' => $package['recommended_age_max'],
        'group_size_min' => $package['group_size_min'],
        'group_size_max' => $package['group_size_max'],
        'guide_included' => (bool)$package['guide_included'],
        'meals_included' => $package['meals_included'],
        'accommodation_level' => $package['accommodation_level'],
        'featured' => (bool)$package['featured'],
        'average_rating' => isset($package['avg_rating']) ? round((float)$package['avg_rating'], 2) : null,
        'review_count' => (int)($package['review_count'] ?? 0),
        'travelers_requested' => $criteria['travelers']
    ];
}

function checkDateAvailability($availableDates, $requestedDate) {
    if (!$requestedDate || empty($availableDates)) {
        return true;
    }
    
    foreach ($availableDates as $dateRange) {
        if (isset($dateRange['start']) && isset($dateRange['end'])) {
            if ($requestedDate >= $dateRange['start'] && $requestedDate <= $dateRange['end']) {
                return true;
            }
        } elseif (isset($dateRange['date'])) {
            if ($requestedDate === $dateRange['date']) {
                return true;
            }
        }
    }
    
    return false;
}

function applyPackageFilters($packages, $filters) {
    $filtered = $packages;
    
    // Price range filter
    if (isset($filters['min_price'])) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return $package['total_price'] >= (float)$filters['min_price'];
        });
    }
    
    if (isset($filters['max_price'])) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return $package['total_price'] <= (float)$filters['max_price'];
        });
    }
    
    // Duration filter
    if (isset($filters['min_duration'])) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return $package['duration_days'] >= (int)$filters['min_duration'];
        });
    }
    
    if (isset($filters['max_duration'])) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return $package['duration_days'] <= (int)$filters['max_duration'];
        });
    }
    
    // Category filter
    if (isset($filters['categories']) && is_array($filters['categories'])) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return in_array($package['category'], $filters['categories']);
        });
    }
    
    // Difficulty level filter
    if (isset($filters['difficulty_levels']) && is_array($filters['difficulty_levels'])) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return in_array($package['difficulty_level'], $filters['difficulty_levels']);
        });
    }
    
    // Accommodation level filter
    if (isset($filters['accommodation_levels']) && is_array($filters['accommodation_levels'])) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return in_array($package['accommodation_level'], $filters['accommodation_levels']);
        });
    }
    
    // Meals filter
    if (isset($filters['meals_included'])) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return $package['meals_included'] === $filters['meals_included'];
        });
    }
    
    // Guide included filter
    if (isset($filters['guide_included']) && $filters['guide_included']) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return $package['guide_included'];
        });
    }
    
    // Rating filter
    if (isset($filters['min_rating'])) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return $package['average_rating'] && $package['average_rating'] >= (float)$filters['min_rating'];
        });
    }
    
    // Available only filter
    if (isset($filters['available_only']) && $filters['available_only']) {
        $filtered = array_filter($filtered, function($package) use ($filters) {
            return $package['is_available'];
        });
    }
    
    return array_values($filtered);
}

function sortPackages($packages, $sortBy) {
    switch ($sortBy) {
        case 'price_asc':
            usort($packages, function($a, $b) {
                return $a['total_price'] <=> $b['total_price'];
            });
            break;
        case 'price_desc':
            usort($packages, function($a, $b) {
                return $b['total_price'] <=> $a['total_price'];
            });
            break;
        case 'duration_asc':
            usort($packages, function($a, $b) {
                return $a['duration_days'] <=> $b['duration_days'];
            });
            break;
        case 'duration_desc':
            usort($packages, function($a, $b) {
                return $b['duration_days'] <=> $a['duration_days'];
            });
            break;
        case 'rating_desc':
            usort($packages, function($a, $b) {
                $aRating = $a['average_rating'] ?: 0;
                $bRating = $b['average_rating'] ?: 0;
                return $bRating <=> $aRating;
            });
            break;
        case 'popularity':
            usort($packages, function($a, $b) {
                return $b['review_count'] <=> $a['review_count'];
            });
            break;
        case 'name_asc':
            usort($packages, function($a, $b) {
                return strcasecmp($a['name'], $b['name']);
            });
            break;
        case 'featured_first':
        default:
            usort($packages, function($a, $b) {
                if ($a['featured'] === $b['featured']) {
                    $aRating = $a['average_rating'] ?: 0;
                    $bRating = $b['average_rating'] ?: 0;
                    return $bRating <=> $aRating;
                }
                return $b['featured'] <=> $a['featured'];
            });
            break;
    }
    
    return $packages;
}
?> 