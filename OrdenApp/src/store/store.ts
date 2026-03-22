import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import trabajosReducer from "./trabajosSlice"; // <-- importamos slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trabajos: trabajosReducer, // <-- añadimos slice aquí
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;