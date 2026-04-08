import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import VectorSource from 'ol/source/Vector'
import { fromLonLat } from 'ol/proj'

export class FieldLayerService {
  static loadPolygons(source: VectorSource, polygons: any[]) {
    polygons.forEach((polygon) => {
      const coords = polygon.coordinates[0].map((coord: number[]) =>
        fromLonLat(coord)
      )

      const feature = new Feature({
        geometry: new Polygon([coords]),
      })

      source.addFeature(feature)
    })
  }
}