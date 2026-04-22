/**
 * Acreage Calculator Service
 * Single Responsibility: Calculate polygon area in acres, square km, and square meters
 * No validation, no limits - pure calculation only
 */

export interface Acreage {
  acres: number
  squareKm: number
  squareMeters: number
  hectares: number
}

/**
 * AcreageCalculator - Single Responsibility: Area calculation
 * Follows OOP encapsulation - private method for calculation logic
 */
export class AcreageCalculator {
  /**
   * Calculate area using Haversine formula
   * @param coordinates - Polygon ring [[lng, lat], [lng, lat], ...]
   * @returns Area in square kilometers
   */
  private static calculateSquareKilometers(coordinates: number[][][]): number {
    if (!coordinates?.length) return 0

    const ring = coordinates[0]
    if (ring.length < 3) return 0

    let area = 0
    const EARTH_RADIUS_KM = 6371

    for (let i = 0; i < ring.length - 1; i++) {
      const [lng1, lat1] = ring[i]
      const [lng2, lat2] = ring[i + 1]

      const deltaLng = ((lng2 - lng1) * Math.PI) / 180
      const lat1Rad = (lat1 * Math.PI) / 180
      const lat2Rad = (lat2 * Math.PI) / 180

      area += (deltaLng / 2) * Math.sin(lat1Rad + lat2Rad) * EARTH_RADIUS_KM * EARTH_RADIUS_KM
    }

    return Math.abs(area)
  }

  /**
   * Calculate area in all units
   * @param coordinates - Polygon coordinates [[[lng, lat], ...]]
   * @returns Acreage object with acres, sq km, sq meters, hectares
   */
  static calculate(coordinates: number[][][]): Acreage {
    const squareKm = this.calculateSquareKilometers(coordinates)
    const hectares = squareKm * 100
    const acres = squareKm * 247.105 // 1 sq km = 247.105 acres
    const squareMeters = squareKm * 1000000

    return {
      acres,
      squareKm,
      hectares,
      squareMeters,
    }
  }

  /**
   * Format acres for display
   * @param acres - Area in acres
   * @returns Formatted string with value and unit
   */
  static format(acres: number): string {
    if (acres >= 640) {
      // 640 acres = 1 square mile
      return `${(acres / 640).toFixed(2)} sq mi`
    } else if (acres >= 1) {
      return `${acres.toFixed(2)} acres`
    } else {
      const sqFeet = acres * 43560 // 1 acre = 43,560 sq feet
      return `${sqFeet.toFixed(0)} sq ft`
    }
  }

  /**
   * Format hectares for display
   * @param hectares - Area in hectares
   * @returns Formatted string with value and unit
   */
  static formatHectares(hectares: number): string {
    if (hectares >= 100) {
      const squareKm = hectares / 100
      return `${squareKm.toFixed(2)} km²`
    } else if (hectares >= 1) {
      return `${hectares.toFixed(2)} ha`
    } else {
      const squareMeters = hectares * 10000
      return `${squareMeters.toFixed(0)} m²`
    }
  }
}
