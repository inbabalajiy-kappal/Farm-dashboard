import Draw from 'ol/interaction/Draw'
import VectorSource from 'ol/source/Vector'

export class InteractionFactory {
  static createPolygonDraw(source: VectorSource) {
    return new Draw({
      source,
      type: 'Polygon',
    })
  }
}