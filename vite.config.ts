import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
const debugPath = path.resolve(__dirname, "src/element/src/sizeHelpers.ts");
console.log("调试路径:", debugPath);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    // alias: {
    //   "@excalidraw/common": path.resolve(__dirname, "src/common/src/index.ts"),
    //   "@excalidraw/common/": path.resolve(__dirname, "src/common/src/"),
    //   "@excalidraw/element": path.resolve(__dirname, "src/element/src/index.ts"),
    //   "@excalidraw/element/": path.resolve(__dirname, "src/element/src/") + "/",
    //   "@excalidraw/excalidraw": path.resolve(__dirname, "src/excalidraw/index.tsx"),
    //   "@excalidraw/excalidraw/": path.resolve(__dirname, "src/excalidraw/"),
    //   "@excalidraw/math": path.resolve(__dirname, "src/math/src/index.ts"),
    //   "@excalidraw/math/": path.resolve(__dirname, "src/math/src/"),
    //   "@excalidraw/utils": path.resolve(__dirname, "src/utils/src/index.ts"),
    //   "@excalidraw/utils/": path.resolve(__dirname, "src/utils/src/"),
    // },
    alias: [
      {
        find: /^@excalidraw\/common$/,
        replacement: path.resolve(__dirname, "src/common/src/index.ts"),
      },
      {
        find: /^@excalidraw\/common\/(.*?)/,
        replacement: path.resolve(__dirname, "src/common/src/$1"),
      },
      {
        find: /^@excalidraw\/element$/,
        replacement: path.resolve(__dirname, "src/element/src/index.ts"),
      },
      {
        find: /^@excalidraw\/element\/(.*?)/,
        replacement: path.resolve(__dirname, "src/element/src/$1"),
      },
      {
        find: /^@excalidraw\/excalidraw$/,
        replacement: path.resolve(__dirname, "src/excalidraw/index.tsx"),
      },
      {
        find: /^@excalidraw\/excalidraw\/(.*?)/,
        replacement: path.resolve(__dirname, "src/excalidraw/$1"),
      },
      {
        find: /^@excalidraw\/math$/,
        replacement: path.resolve(__dirname, "src/math/src/index.ts"),
      },
      {
        find: /^@excalidraw\/math\/(.*?)/,
        replacement: path.resolve(__dirname, "src/math/src/$1"),
      },
      {
        find: /^@excalidraw\/utils$/,
        replacement: path.resolve(__dirname, "src/utils/src/index.ts"),
      },
      {
        find: /^@excalidraw\/utils\/(.*?)/,
        replacement: path.resolve(__dirname, "src/utils/src/$1"),
      },
    ],
  },
});
