import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EstadoTrabajo =
  | "Pendiente"
  | "En proceso"
  | "Completado";

export type TrabajoItem = {
  id: string;
  label: string;
  expanded: boolean;
  quantity: number;
  notes: string;
  pdfAttached: boolean;
  pdfName?: string;
  photoUri?: string;

  // NUEVO
  status: EstadoTrabajo;
};

interface TrabajosState {
  items: TrabajoItem[];
}

const initialState: TrabajosState = {
  items: [
    {
      id: "1",
      label: "Talonario Fiscal",
      expanded: false,
      quantity: 0,
      notes: "",
      pdfAttached: false,
      status: "Pendiente",
    },
    {
      id: "2",
      label: "Talonario Control Interno",
      expanded: false,
      quantity: 0,
      notes: "",
      pdfAttached: false,
      status: "Pendiente",
    },
    {
      id: "3",
      label: "Brochure",
      expanded: false,
      quantity: 0,
      notes: "",
      pdfAttached: false,
      status: "Pendiente",
    },
    {
      id: "4",
      label: "Tarjetas de presentación",
      expanded: false,
      quantity: 0,
      notes: "",
      pdfAttached: false,
      status: "Pendiente",
    },
    {
      id: "5",
      label: "Otros",
      expanded: false,
      quantity: 0,
      notes: "",
      pdfAttached: false,
      status: "Pendiente",
    },
  ],
};

const trabajosSlice = createSlice({
  name: "trabajos",
  initialState,
  reducers: {
    updateTrabajo: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<TrabajoItem>;
      }>
    ) => {
      const { id, changes } = action.payload;

      const index = state.items.findIndex(
        (item) => item.id === id
      );

      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...changes,
        };
      }
    },

    setTrabajos: (
      state,
      action: PayloadAction<TrabajoItem[]>
    ) => {
      state.items = action.payload;
    },

    resetTrabajos: (state) => {
      state.items = initialState.items;
    },
  },
});

export const {
  updateTrabajo,
  setTrabajos,
  resetTrabajos,
} = trabajosSlice.actions;

export default trabajosSlice.reducer;