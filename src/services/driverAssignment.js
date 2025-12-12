/**
 * Driver Assignment Service
 * Handles automatic assignment of orders to drivers based on proximity and capacity
 */

import Driver from '../models/Driver';

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1 (in degrees)
 * @param {number} lon1 - Longitude of point 1 (in degrees)
 * @param {number} lat2 - Latitude of point 2 (in degrees)
 * @param {number} lon2 - Longitude of point 2 (in degrees)
 * @returns {number} Distance in kilometers, rounded to 2 decimal places
 * @throws {Error} If any coordinate is not a valid number
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    // Validate inputs
    if (!isFinite(lat1) || !isFinite(lon1) || !isFinite(lat2) || !isFinite(lon2)) {
        throw new Error('All coordinates must be valid numbers');
    }

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimals
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Find the best driver for an order
 * @param {Object} order - Order object with pickup location and package details
 * @param {Array} drivers - Array of available drivers
 * @returns {Object} Result with success status, driver, distance, and reason
 */
export function findBestDriver(order, drivers) {
    if (!order.pickupAddress?.coordinates) {
        return {
            success: false,
            reason: 'Order missing pickup coordinates',
            driver: null,
            distance: null
        };
    }

    if (!drivers || drivers.length === 0) {
        return {
            success: false,
            reason: 'No drivers available',
            driver: null,
            distance: null
        };
    }

    const { lat: pickupLat, lng: pickupLng } = order.pickupAddress.coordinates;

    // Filter available drivers who can handle the package
    const suitableDrivers = drivers
        .filter(driver => {
            // Check availability
            if (!driver.isAvailable()) {
                return false;
            }

            // Check if driver has location
            if (!driver.currentLocation) {
                return false;
            }

            // Check vehicle capacity
            if (!driver.canHandlePackage(order.package)) {
                return false;
            }

            return true;
        })
        .map(driver => {
            // Calculate distance to pickup
            const distance = calculateDistance(
                driver.currentLocation.lat,
                driver.currentLocation.lng,
                pickupLat,
                pickupLng
            );

            return {
                driver,
                distance
            };
        })
        .sort((a, b) => {
            // Sort by distance (closest first)
            if (a.distance !== b.distance) {
                return a.distance - b.distance;
            }
            // Tiebreaker: prefer driver with fewer active orders
            if (a.driver.activeOrders !== b.driver.activeOrders) {
                return a.driver.activeOrders - b.driver.activeOrders;
            }
            // Tiebreaker: prefer higher rating
            return b.driver.rating - a.driver.rating;
        });

    if (suitableDrivers.length === 0) {
        // Determine specific reason for failure
        const hasAvailableDrivers = drivers.some(d => d.isAvailable());
        const hasDriversWithLocation = drivers.some(d => d.currentLocation);
        const hasDriversWithCapacity = drivers.some(d => d.canHandlePackage(order.package));

        let reason = 'No suitable drivers found';
        if (!hasAvailableDrivers) {
            reason = 'All drivers are busy or offline';
        } else if (!hasDriversWithLocation) {
            reason = 'No drivers with location data';
        } else if (!hasDriversWithCapacity) {
            reason = `No vehicles can handle package (${order.package.weight}kg, ${calculatePackageVolume(order.package.dimensions)}L)`;
        }

        return {
            success: false,
            reason,
            driver: null,
            distance: null
        };
    }

    const best = suitableDrivers[0];

    return {
        success: true,
        driver: best.driver,
        distance: best.distance,
        reason: `Assigned to closest driver (${best.distance}km away)`
    };
}

function calculatePackageVolume(dimensions) {
    if (!dimensions) return 0;
    const { length = 0, width = 0, height = 0 } = dimensions;
    return Math.round((length * width * height) / 1000); // Convert cm³ to liters
}

/**
 * Assign a driver to an order
 * @param {Object} order - Order object
 * @param {Object} driver - Driver object
 * @returns {Object} Updated order with assignment details
 */
export function assignDriverToOrder(order, driver, distance) {
    const now = new Date().toISOString();

    // Update order
    order.status = 'assigned';
    order.driverId = driver.id;
    order.driverName = driver.name;
    order.assignedAt = now;
    order.assignmentMethod = 'auto';
    order.estimatedDistance = distance;

    // Update driver
    driver.assignOrder();

    return order;
}

/**
 * Get distance threshold warnings
 * @param {number} distance - Distance in km
 * @returns {Object} Warning level and message
 */
export function getDistanceWarning(distance) {
    if (distance < 5) {
        return { level: 'ideal', message: 'Optimal distance' };
    } else if (distance < 10) {
        return { level: 'acceptable', message: 'Acceptable distance' };
    } else if (distance < 20) {
        return { level: 'warning', message: 'Long distance - higher cost expected' };
    } else {
        return { level: 'critical', message: 'Very long distance - manual review recommended' };
    }
}

export default {
    calculateDistance,
    findBestDriver,
    assignDriverToOrder,
    getDistanceWarning
};
