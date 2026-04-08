'use client'

import { useQuery } from '@tanstack/react-query'
import { PolygonService } from '../services/PolygonService'

export function useFieldMap() {
  const polygons = useQuery({
    queryKey: ['field-polygons'],
    queryFn: () => PolygonService.getPolygons(),
  })

  return {
    polygons,
  }
}