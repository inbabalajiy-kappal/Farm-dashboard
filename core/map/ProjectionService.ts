import { fromLonLat } from 'ol/proj'

export class ProjectionService {
  static toMapProjection(coords: [number, number]) {
    return fromLonLat(coords)
  }
}