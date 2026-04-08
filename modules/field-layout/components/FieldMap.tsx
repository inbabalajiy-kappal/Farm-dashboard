'use client'

import { useEffect, useRef } from 'react'
import { MapFactory } from '../../../core/map/MapFactory'

import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Draw from 'ol/interaction/Draw'

export function FieldMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = MapFactory.create(mapRef.current)

    const vectorSource = new VectorSource()

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    })

    map.addLayer(vectorLayer)

    const draw = new Draw({
      source: vectorSource,
      type: 'Polygon',
    })

    map.addInteraction(draw)

    return () => {
      map.setTarget(undefined)
    }
  }, [])

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100vh',
      }}
    />
  )
}