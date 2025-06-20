import express from 'express';

const router = express.Router();

// Simple test endpoint
router.get('/hello', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is working!',
    timestamp: new Date().toISOString()
  });
});

// Test flights endpoint with mock data
router.get('/flights', (req, res) => {
  const mockFlights = [
    {
      id: 1,
      airline: 'AirAsia',
      airline_logo: '/airasia-logo.png',
      flight_number: 'AK101',
      origin: 'Kuala Lumpur',
      destination: 'Da Nang',
      origin_code: 'KUL',
      destination_code: 'DAD',
      departure_time: '2024-01-15T08:00:00Z',
      arrival_time: '2024-01-15T11:00:00Z',
      duration: 180,
      price: 299.99,
      currency: 'MYR',
      stops: 0,
      status: 'scheduled'
    },
    {
      id: 2,
      airline: 'Malaysia Airlines',
      airline_logo: '/malaysia-airlines-logo.png',
      flight_number: 'MH102',
      origin: 'Kuala Lumpur',
      destination: 'Bangkok',
      origin_code: 'KUL',
      destination_code: 'BKK',
      departure_time: '2024-01-15T14:30:00Z',
      arrival_time: '2024-01-15T15:30:00Z',
      duration: 60,
      price: 199.99,
      currency: 'MYR',
      stops: 0,
      status: 'scheduled'
    },
    {
      id: 3,
      airline: 'Singapore Airlines',
      airline_logo: '/singapore-airlines-logo.png',
      flight_number: 'SQ103',
      origin: 'Singapore',
      destination: 'Tokyo',
      origin_code: 'SIN',
      destination_code: 'NRT',
      departure_time: '2024-01-15T22:45:00Z',
      arrival_time: '2024-01-16T06:30:00Z',
      duration: 465,
      price: 899.99,
      currency: 'MYR',
      stops: 0,
      status: 'scheduled'
    }
  ];

  res.json({
    success: true,
    flights: mockFlights,
    pagination: {
      current_page: 1,
      per_page: 10,
      total_results: mockFlights.length,
      total_pages: 1,
      has_next_page: false,
      has_prev_page: false
    }
  });
});

// Test flight search endpoint
router.post('/search', (req, res) => {
  const { origin, destination } = req.body;
  
  const mockFlights = [
    {
      id: 1,
      airline: 'AirAsia',
      airline_logo: '/airasia-logo.png',
      flight_number: 'AK101',
      origin: origin || 'Kuala Lumpur',
      destination: destination || 'Da Nang',
      origin_code: 'KUL',
      destination_code: 'DAD',
      departure_time: '2024-01-15T08:00:00Z',
      arrival_time: '2024-01-15T11:00:00Z',
      duration: 180,
      price: 299.99,
      currency: 'MYR',
      stops: 0,
      status: 'scheduled'
    }
  ];

  res.json({
    success: true,
    flights: mockFlights,
    message: `Found ${mockFlights.length} flights from ${origin || 'KUL'} to ${destination || 'DAD'}`
  });
});

export default router; 