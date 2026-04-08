import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'

export class LayerFactory {
  static createBaseLayer() {
    return new TileLayer({
      source: new OSM(),
    })
  }

  static createVectorLayer() {
    return new VectorLayer({
      source: new VectorSource(),
    })
  }
}