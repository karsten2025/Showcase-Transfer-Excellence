import { create } from 'zustand';

interface AppState {
  abfindungsfaktor: number;
  nettoAufstockung: number;
  haertefallAlter: number;
  sprinterPraemie: boolean;
  setAbfindungsfaktor: (val: number) => void;
  setNettoAufstockung: (val: number) => void;
  setHaertefallAlter: (val: number) => void;
  setSprinterPraemie: (val: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  abfindungsfaktor: 1.2,
  nettoAufstockung: 85,
  haertefallAlter: 60,
  sprinterPraemie: false,
  setAbfindungsfaktor: (val) => set({ abfindungsfaktor: val }),
  setNettoAufstockung: (val) => set({ nettoAufstockung: val }),
  setHaertefallAlter: (val) => set({ haertefallAlter: val }),
  setSprinterPraemie: (val) => set({ sprinterPraemie: val }),
}));
