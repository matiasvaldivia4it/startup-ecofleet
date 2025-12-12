import { describe, it, expect, beforeEach } from 'vitest';
import { calculateDistance, findBestDriver, getDistanceWarning, assignDriverToOrder } from '../driverAssignment';

describe('Driver Assignment Service', () => {
    describe('calculateDistance', () => {
        it('should calculate distance correctly between two points', () => {
            // New York (40.7128, -74.0060) to Los Angeles (34.0522, -118.2437)
            // Distance is approx 3936 km
            const dist = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
            expect(dist).toBeGreaterThan(3900);
            expect(dist).toBeLessThan(4000);
        });

        it('should return 0 for same location', () => {
            const dist = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
            expect(dist).toBe(0);
        });
    });

    describe('findBestDriver', () => {
        const mockOrder = {
            pickupAddress: {
                coordinates: { lat: 0, lng: 0 }
            },
            package: {
                weight: 5,
                dimensions: { length: 10, width: 10, height: 10 }
            }
        };

        const createMockDriver = (id, lat, lng, available = true, activeOrders = 0) => ({
            id,
            name: `Driver ${id}`,
            currentLocation: { lat, lng },
            isAvailable: () => available,
            activeOrders,
            rating: 5,
            canHandlePackage: () => true
        });

        it('should find the closest driver', () => {
            const drivers = [
                createMockDriver('d1', 10, 10), // Far
                createMockDriver('d2', 0.1, 0.1), // Close
                createMockDriver('d3', 1, 1) // Medium
            ];

            const result = findBestDriver(mockOrder, drivers);
            expect(result.success).toBe(true);
            expect(result.driver.id).toBe('d2');
        });

        it('should return failure if no drivers available', () => {
            const drivers = [
                createMockDriver('d1', 10, 10, false)
            ];

            const result = findBestDriver(mockOrder, drivers);
            expect(result.success).toBe(false);
            expect(result.reason).toContain('busy or offline');
        });
    });

    describe('getDistanceWarning', () => {
        it('should return ideal for short distances', () => {
            expect(getDistanceWarning(3).level).toBe('ideal');
        });

        it('should return critical for very long distances', () => {
            expect(getDistanceWarning(25).level).toBe('critical');
        });
    });
});
