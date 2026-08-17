import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuracion minima de Vite para el proyecto Gravedad100 - Clases y horarios (React)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
