'use client'

import { useMapStore } from '../../../store/map.store'

export function LayerToggle() {
  const { showLayer, toggleLayer } = useMapStore()

  return (
    <button onClick={toggleLayer}>
      {showLayer ? 'Hide Layer' : 'Show Layer'}
    </button>
  )
}