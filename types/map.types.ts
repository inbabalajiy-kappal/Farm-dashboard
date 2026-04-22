export interface FieldPolygon {
  id: string
  coordinates: number[][][]
  areaHectares?: number // Area in hectares
  areaSquareKm?: number // Area in square kilometers
  areaSquareMeters?: number // Area in square meters
  ownerName?: string // Owner or manager name
  contactDetails?: string // Phone or email
  address?: string // Physical address
  createdAt?: Date // Creation timestamp
  lastModified?: Date // Last modification timestamp
}