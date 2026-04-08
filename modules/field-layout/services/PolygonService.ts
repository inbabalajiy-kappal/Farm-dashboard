import { FieldPolygonModel } from '../models/FieldPolygon.model'

export class PolygonService {
  static getPolygons() {
    return [
      new FieldPolygonModel('1', [
        [
          [78.95, 20.59],
          [78.96, 20.59],
          [78.96, 20.60],
          [78.95, 20.60],
          [78.95, 20.59],
        ],
      ]),
    ]
  }
}