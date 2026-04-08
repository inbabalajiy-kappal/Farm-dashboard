import { FieldPolygon } from '../../../types/map.types'

export class FieldPolygonModel implements FieldPolygon {
  constructor(
    public id: string,
    public coordinates: number[][][]
  ) {}
}