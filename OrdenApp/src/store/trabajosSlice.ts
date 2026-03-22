import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asset } from "react-native-image-picker"; // Asegúrate de este import

export type TrabajoItem = {
  id: string;
  label: string;
  expanded: boolean;
  quantity: number;
  notes: string;
  pdfAttached: boolean;
  pdfName?: string;   // opcional
  photoUri?: string;  // opcional, solo URI
};

interface TrabajosState {
  items: TrabajoItem[];
}

const initialState: TrabajosState = {
  items: [
    { id: '1', label: 'Talonario Fiscal', expanded: false, quantity: 0, notes: '', pdfAttached: false },
    { id: '2', label: 'Talonario Control Interno', expanded: false, quantity: 0, notes: '', pdfAttached: false },
    { id: '3', label: 'Brochure', expanded: false, quantity: 0, notes: '', pdfAttached: false },
    { id: '4', label: 'Tarjetas de presentación', expanded: false, quantity: 0, notes: '', pdfAttached: false },
    { id: '5', label: 'Otros', expanded: false, quantity: 0, notes: '', pdfAttached: false },
  ]
};

const trabajosSlice = createSlice({
  name: "trabajos",
  initialState,
  reducers: {
    updateTrabajo: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<TrabajoItem> }>
    ) => {
      const { id, changes } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...changes };
      }
    },
    setTrabajos: (state, action: PayloadAction<TrabajoItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { updateTrabajo, setTrabajos } = trabajosSlice.actions;
export default trabajosSlice.reducer;