import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

import {dependencies} from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
    modulePreload: false,
    cssCodeSplit: false
  },
  plugins: [
    react(),

    federation({
      name: "shell",
      filename: "remoteEntry.js",
      remotes: {
        "@modules/playlists": "http://localhost:4001/assets/remoteEntry.js",
        "@modules/albums": "http://localhost:4002/assets/remoteEntry.js",
      },      
      shared: { 
        ...dependencies,
        'react': {
          requiredVersion: dependencies['react']
          
        },
        'react-dom': {
          requiredVersion: dependencies['react-dom']
        },
        "@modules/common": {
          packagePath: path.resolve('../common'),
          requiredVersion: false
        }
      }
    }),
  ],
});
