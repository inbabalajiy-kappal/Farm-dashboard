import { create } from 'zustand'

interface MapState {
  showLayer: boolean
  toggleLayer: () => void
}

export const useMapStore = create<MapState>((set) => ({
  showLayer: true,
  toggleLayer: () =>
    set((state) => ({
      showLayer: !state.showLayer,
    })),
}))