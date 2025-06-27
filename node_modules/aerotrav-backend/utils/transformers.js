/**
 * Transform car data from database format to API response format
 */
export const transformCarData = (car) => {
  try {
    if (!car) return null;

    // Parse JSON fields
    let features = [];
    let images = [];

    try {
      features = JSON.parse(car.features || '[]');
    } catch (e) {
      console.warn('Failed to parse car features:', e);
    }

    try {
      images = JSON.parse(car.images || '[]');
    } catch (e) {
      console.warn('Failed to parse car images:', e);
    }

    return {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      category: car.category,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      doors: car.doors,
      seats: car.seats,
      luggage_capacity: car.luggage_capacity,
      air_conditioning: Boolean(car.air_conditioning),
      features,
      images,
      daily_rate: parseFloat(car.daily_rate),
      location_city: car.location_city,
      location_country: car.location_country,
      rental_company: car.rental_company,
      available_cars: car.available_cars,
      mileage_limit: car.mileage_limit,
      min_driver_age: car.min_driver_age,
      status: car.status,
      rating: car.rating ? parseFloat(car.rating) : undefined,
      review_count: car.review_count ? parseInt(car.review_count) : undefined,
      created_at: car.created_at,
      updated_at: car.updated_at
    };
  } catch (error) {
    console.error('Failed to transform car data:', error);
    return null;
  }
}; 