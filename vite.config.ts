import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@excalidraw/common": path.resolve(__dirname, "src/common/src/index.ts"),
      "@excalidraw/common/": path.resolve(__dirname, "src/common/src/"),
      "@excalidraw/element": path.resolve(__dirname, "src/element/src/index.ts"),
      "@excalidraw/element/*": path.resolve(__dirname, "src/element/src/*"),
      "@excalidraw/excalidraw": path.resolve(__dirname, "src/excalidraw/index.tsx"),
      "@excalidraw/excalidraw/*": path.resolve(__dirname, "src/excalidraw/*"),
      "@excalidraw/math": path.resolve(__dirname, "src/math/src/index.ts"),
      "@excalidraw/math/*": path.resolve(__dirname, "src/math/src/*"),
      "@excalidraw/utils": path.resolve(__dirname, "src/utils/src/index.ts"),
      "@excalidraw/utils/*": path.resolve(__dirname, "src/utils/src/*"),
    },
  },
});