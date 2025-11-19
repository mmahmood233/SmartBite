/**
 * Location Service
 * 
 * Handles location permissions, distance calculations, and delivery time estimates
 */

import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Request location permissions
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get current user location
 */
export const getCurrentLocation = async (): Promise<Coordinates | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Estimate delivery time based on distance
 * Assumes average speed of 30 km/h in city traffic + preparation time
 * Returns time in minutes
 */
export const estimateDeliveryTime = (
  distanceKm: number,
  preparationTime: number = 20
): number => {
  const averageSpeedKmh = 30; // Average delivery speed in city
  const travelTimeMinutes = (distanceKm / averageSpeedKmh) * 60;
  const totalTime = Math.ceil(preparationTime + travelTimeMinutes);
  
  return totalTime;
};

/**
 * Format delivery time for display
 * Returns formatted string like "25-35 min"
 */
export const formatDeliveryTime = (estimatedMinutes: number): string => {
  const min = Math.max(15, estimatedMinutes - 5); // Minimum 15 min
  const max = estimatedMinutes + 5;
  return `${min}-${max} min`;
};

/**
 * Get distance and estimated time between user and restaurant
 */
export const getDeliveryEstimate = async (
  restaurantCoords: Coordinates,
  preparationTime: number = 20
): Promise<{
  distance: number;
  estimatedTime: number;
  formattedTime: string;
} | null> => {
  try {
    const userLocation = await getCurrentLocation();
    if (!userLocation) {
      return null;
    }

    const distance = calculateDistance(userLocation, restaurantCoords);
    const estimatedTime = estimateDeliveryTime(distance, preparationTime);
    const formattedTime = formatDeliveryTime(estimatedTime);

    return {
      distance,
      estimatedTime,
      formattedTime,
    };
  } catch (error) {
    console.error('Error calculating delivery estimate:', error);
    return null;
  }
};

/**
 * Parse address string to coordinates using geocoding
 */
export const geocodeAddress = async (
  address: string
): Promise<Coordinates | null> => {
  try {
    const results = await Location.geocodeAsync(address);
    if (results.length > 0) {
      return {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (
  coords: Coordinates
): Promise<string | null> => {
  try {
    const results = await Location.reverseGeocodeAsync(coords);
    if (results.length > 0) {
      const result = results[0];
      return `${result.street || ''}, ${result.city || ''}, ${result.region || ''}`.trim();
    }
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};
