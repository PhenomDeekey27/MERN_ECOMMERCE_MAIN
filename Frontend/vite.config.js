import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {'process.env': process.env},
  css:{
    postcss:{
      plugins:[tailwindcss()]
    }
  },
  server:{
    proxy:{
      "/api":"http://localhost:8000"
    }
  }
})
