'use client'

import { useEffect, useRef, useState } from 'react'
import { MapFactory } from '../../../core/map/MapFactory'

import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Draw from 'ol/interaction/Draw'
import type Map from 'ol/Map'

export function FieldMap() {
  const mapElementRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)
  const drawInteractionRef = useRef<Draw | null>(null)
  const vectorSourceRef = useRef<VectorSource | null>(null)

  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    initializeMap()

    return () => {
      destroyMap()
    }
  }, [])

  const initializeMap = () => {
    if (!mapElementRef.current) return

    const map = MapFactory.create(mapElementRef.current)
    const vectorSource = createVectorSource()
    const vectorLayer = createVectorLayer(vectorSource)
    const drawInteraction = createDrawInteraction(vectorSource)

    map.addLayer(vectorLayer)

    mapInstanceRef.current = map
    vectorSourceRef.current = vectorSource
    drawInteractionRef.current = drawInteraction
  }

  const createVectorSource = (): VectorSource => {
    return new VectorSource()
  }

  const createVectorLayer = (source: VectorSource): VectorLayer<VectorSource> => {
    return new VectorLayer({
      source,
    })
  }

  const createDrawInteraction = (source: VectorSource): Draw => {
    return new Draw({
      source,
      type: 'Polygon',
    })
  }

  const toggleDrawMode = () => {
    if (!mapInstanceRef.current || !drawInteractionRef.current) return

    if (isDrawing) {
      mapInstanceRef.current.removeInteraction(drawInteractionRef.current)
      setIsDrawing(false)
      return
    }

    mapInstanceRef.current.addInteraction(drawInteractionRef.current)
    setIsDrawing(true)
  }

  const destroyMap = () => {
    mapInstanceRef.current?.setTarget(undefined)
  }

  return (
    <div>
      <div
        ref={mapElementRef}
        style={{
          width: '100%',
          height: '90vh',
        }}
      />

      <div
        style={{
          textAlign: 'center',
          marginTop: '10px',
        }}
      >
       <button
  onClick={toggleDrawMode}
  style={{
    padding: '10px 20px',
    cursor: 'pointer',
  }}
>
  {isDrawing ? 'Stop Mapping' : 'Map Your Area'}
</button>
      </div>
    </div>
  )
}