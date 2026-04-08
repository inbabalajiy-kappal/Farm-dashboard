import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../shared/constants/map.constants'

export class MapFactory {
  static create(target: HTMLDivElement) {
    return new Map({
      target,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      }),
    })
  }
}