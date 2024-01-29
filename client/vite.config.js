import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: `import React from 'react'`, // if not using React 17
  },
  optimizeDeps: {
    include: ["lowlight"], // ensure lowlight is included in the bundle
  },
});
