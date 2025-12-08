/**
 * Carbon Footprint Calculator Service
 * Calculates CO2 emissions saved by using EcoFleet vs traditional diesel delivery
 */

// Emission factors (kg CO2 per km)
const EMISSION_FACTORS = {
    DIESEL_VAN: 0.280, // Average diesel delivery van
    DIESEL_MOTORCYCLE: 0.113, // Average petrol motorcycle
    ELECTRIC_VAN: 0.053, // EV charged with Chilean grid mix (approx)
    ELECTRIC_MOTORCYCLE: 0.021, // Electric motorcycle/scooter
    BICYCLE: 0.0 // Human powered
};

// Tree absorption (kg CO2 per year)
const TREE_ABSORPTION_PER_YEAR = 22;

/**
 * Calculate CO2 emissions for a delivery
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} vehicleType - Type of vehicle used
 * @returns {Object} Emissions data
 */
export function calculateEmissions(distanceKm, vehicleType = 'electric-van') {
    let evFactor = EMISSION_FACTORS.ELECTRIC_VAN;
    let dieselFactor = EMISSION_FACTORS.DIESEL_VAN;

    // Adjust factors based on vehicle type
    if (['bicycle', 'scooter', 'motorcycle'].includes(vehicleType)) {
        evFactor = vehicleType === 'bicycle' ? 0 : EMISSION_FACTORS.ELECTRIC_MOTORCYCLE;
        dieselFactor = EMISSION_FACTORS.DIESEL_MOTORCYCLE;
    }

    const dieselEmissions = distanceKm * dieselFactor;
    const evEmissions = distanceKm * evFactor;
    const savedEmissions = Math.max(0, dieselEmissions - evEmissions);

    return {
        diesel: parseFloat(dieselEmissions.toFixed(3)),
        ev: parseFloat(evEmissions.toFixed(3)),
        saved: parseFloat(savedEmissions.toFixed(3))
    };
}

/**
 * Convert CO2 savings to "Trees Planted" equivalent
 * @param {number} co2SavedKg - Total CO2 saved in kg
 * @returns {number} Number of trees equivalent
 */
export function getTreesEquivalent(co2SavedKg) {
    // How many trees would it take to absorb this amount in a year?
    return parseFloat((co2SavedKg / TREE_ABSORPTION_PER_YEAR).toFixed(2));
}

/**
 * Get sustainability impact stats for a customer
 * @param {Array} orders - List of customer orders
 * @returns {Object} Impact statistics
 */
export function getCustomerImpact(orders) {
    const completedOrders = orders.filter(o => o.status === 'delivered');

    let totalDistance = 0;
    let totalSavedCO2 = 0;
    let electricKm = 0;

    completedOrders.forEach(order => {
        const distance = order.estimatedDistance || order.distance || 5; // Fallback to 5km if missing
        totalDistance += distance;

        // Assume all our deliveries are electric/eco
        electricKm += distance;

        // Calculate savings for this order
        // Default to van comparison if vehicle type unknown
        const emissions = calculateEmissions(distance, 'electric-van');
        totalSavedCO2 += emissions.saved;
    });

    return {
        totalOrders: completedOrders.length,
        totalDistance: parseFloat(totalDistance.toFixed(1)),
        electricKm: parseFloat(electricKm.toFixed(1)),
        co2SavedKg: parseFloat(totalSavedCO2.toFixed(2)),
        treesEquivalent: getTreesEquivalent(totalSavedCO2)
    };
}

export default {
    calculateEmissions,
    getTreesEquivalent,
    getCustomerImpact,
    EMISSION_FACTORS
};
