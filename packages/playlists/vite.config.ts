import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import federation from "@originjs/vite-plugin-federation";
import { dependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
    modulePreload: false,
    cssCodeSplit: false,
  },
  plugins: [
    react(),
    federation({
      name: "albums",
      filename: "remoteEntry.js",
      exposes: {
        "./CreatePlaylist": "./src/CreatePlaylist.tsx",
        "./Playlists": "./src/Playlists.tsx",
      },
      shared: {
        ...dependencies,
        react: {
          requiredVersion: dependencies["react"],
        },
        "react-dom": {
          requiredVersion: dependencies["react-dom"],
        },
        "common": {
          packagePath: path.resolve("../common"),
          requiredVersion: false,
        },
      },
    }),
  ],
});
