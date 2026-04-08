import { PolygonService } from '../services/PolygonService'

export function useFieldMap() {
  const polygons = PolygonService.getPolygons()

  return {
    polygons,
  }
}