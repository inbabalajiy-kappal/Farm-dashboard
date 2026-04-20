'use client'

import { useEffect, useRef, useState } from 'react'
import { MapFactory } from '../../../core/map/MapFactory'

import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Draw from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import type Map from 'ol/Map'

import Style from 'ol/style/Style'
import Text from 'ol/style/Text'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

export function FieldMap() {
  const mapElementRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)
  const drawRef = useRef<Draw | null>(null)
  const modifyRef = useRef<Modify | null>(null)
  const vectorSourceRef = useRef<VectorSource | null>(null)

  const [isDrawing, setIsDrawing] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [showPopup, setShowPopup] = useState(false)
  const [ownerName, setOwnerName] = useState('')
  const [selectedFeature, setSelectedFeature] = useState<any>(null)

  useEffect(() => {
    initializeMap()
    return () => destroyMap()
  }, [])

  // ✅ INIT MAP
  const initializeMap = () => {
    if (!mapElementRef.current) return

    const map = MapFactory.create(mapElementRef.current)

    const vectorSource = new VectorSource()
    const vectorLayer = new VectorLayer({ source: vectorSource })

    const draw = createDrawInteraction(vectorSource)
    const modify = new Modify({ source: vectorSource })

    map.addLayer(vectorLayer)

    // ❌ DO NOT ADD MODIFY HERE (controlled via button)

    // ✅ Click → Open popup for edit
    map.on('singleclick', (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        setSelectedFeature(feature)

        const text = feature.getStyle()?.getText()?.getText()
        if (text) {
          setOwnerName(text.split('\n')[0])
        }

        setShowPopup(true)
      })
    })

    mapInstanceRef.current = map
    vectorSourceRef.current = vectorSource
    drawRef.current = draw
    modifyRef.current = modify
  }

  // ✅ CALCULATE AREA (Haversine formula - returns acres)
  const calcArea = (coords: number[][]): number => {
    if (coords.length < 3) return 0
    let area = 0
    const R = 6371 // Earth radius in km
    for (let i = 0; i < coords.length - 1; i++) {
      const [lng1, lat1] = coords[i]
      const [lng2, lat2] = coords[i + 1]
      const dLat = ((lat2 - lat1) * Math.PI) / 180
      const dLng = ((lng2 - lng1) * Math.PI) / 180
      area += Math.sin(dLat / 2) * Math.sin(dLng / 2)
    }
    const hectares = Math.abs(area) * 2 * R * R * 100
    return hectares * 2.471 // Convert to acres
  }

  // ✅ DRAW
  const createDrawInteraction = (source: VectorSource): Draw => {
    const draw = new Draw({
      source,
      type: 'Polygon',
    })

    draw.on('drawend', (event) => {
      const feature = event.feature
      feature.setId(Date.now())
      
      const coords = feature.getGeometry().getCoordinates()[0]
      const acres = calcArea(coords)
      feature.set('acres', acres)

      setSelectedFeature(feature)
      setOwnerName('')
      setShowPopup(true)
    })

    return draw
  }

  // ✅ STYLE
  const createOwnerStyle = (name: string, acres?: number): Style =>
    new Style({
      stroke: new Stroke({ color: 'blue', width: 2 }),
      fill: new Fill({ color: 'rgba(0,0,255,0.1)' }),
      text: new Text({
        text: `${name}\n${acres ? acres.toFixed(2) + ' ac' : ''}`,
        fill: new Fill({ color: '#000' }),
        backgroundFill: new Fill({ color: '#fff' }),
        padding: [4, 4, 4, 4],
      }),
    })

  // ✅ SAVE / EDIT OWNER
  const handleSave = () => {
    if (!selectedFeature || !ownerName) return

    const acres = selectedFeature.get('acres')
    selectedFeature.setStyle(createOwnerStyle(ownerName, acres))

    setShowPopup(false)
    setOwnerName('')
  }

  // ✅ DELETE
  const handleDelete = () => {
    if (!selectedFeature || !vectorSourceRef.current) return

    vectorSourceRef.current.removeFeature(selectedFeature)

    setShowPopup(false)
    setSelectedFeature(null)
  }

  // ✅ DRAW TOGGLE
  const toggleDraw = () => {
    if (!mapInstanceRef.current || !drawRef.current) return

    if (isDrawing) {
      mapInstanceRef.current.removeInteraction(drawRef.current)
      setIsDrawing(false)
      return
    }

    mapInstanceRef.current.addInteraction(drawRef.current)
    setIsDrawing(true)
  }

  // ✅ EDIT MODE TOGGLE (IMPORTANT FEATURE)
  const toggleEditMode = () => {
    if (!mapInstanceRef.current || !modifyRef.current || isDrawing) return

    if (isEditMode) {
      mapInstanceRef.current.removeInteraction(modifyRef.current)
      setIsEditMode(false)
    } else {
      modifyRef.current.un('modifyend', handleModifyEnd)
      modifyRef.current.on('modifyend', handleModifyEnd)
      mapInstanceRef.current.addInteraction(modifyRef.current)
      setIsEditMode(true)
    }
  }

  // ✅ RECALC AREA ON EDIT
  const handleModifyEnd = (event: any) => {
    event.features.forEach((feature: any) => {
      const coords = feature.getGeometry().getCoordinates()[0]
      const acres = calcArea(coords)
      feature.set('acres', acres)
      
      const owner = feature.getStyle()?.getText()?.getText()?.split('\n')[0]
      if (owner) {
        feature.setStyle(createOwnerStyle(owner, acres))
      }
    })
  }

  const destroyMap = () => {
    mapInstanceRef.current?.setTarget(undefined)
  }

  return (
    <div>
      {/* MAP */}
      <div
        ref={mapElementRef}
        style={{
          width: '100%',
          height: '90vh',
        }}
      />

      {/* BUTTONS */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          onClick={toggleDraw}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          {isDrawing ? 'Stop Mapping' : 'Map Your Area'}
        </button>

        <button
          onClick={toggleEditMode}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          {isEditMode ? 'Stop Editing' : 'Edit Polygon'}
        </button>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Map Owner</h3>

            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Enter owner name"
              style={{ padding: '8px', width: '100%' }}
            />

            <div style={{ marginTop: '15px' }}>
              <button onClick={handleSave} style={saveBtn}>
                Save
              </button>

              <button onClick={handleDelete} style={deleteBtn}>
                Delete
              </button>

              <button
                onClick={() => setShowPopup(false)}
                style={cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ✅ STYLES
const overlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const modalStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '10px',
  width: '300px',
}

const saveBtn = {
  marginRight: '10px',
  padding: '8px 16px',
  background: 'green',
  color: '#fff',
}

const deleteBtn = {
  marginRight: '10px',
  padding: '8px 16px',
  background: 'red',
  color: '#fff',
}

const cancelBtn = {
  padding: '8px 16px',
}