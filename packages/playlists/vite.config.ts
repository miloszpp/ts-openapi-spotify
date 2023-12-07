import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { join } from "path";
import federation from "@originjs/vite-plugin-federation";
import { dependencies } from "./package.json";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        common: {
          packagePath: path.resolve("../common"),
          requiredVersion: false,
        },
        "react/jsx-runtime": {
          packagePath: join(
            __dirname,
            '..',
            '..',
            "node_modules",
            "react",
            "jsx-runtime.js"
          ),
        },
      },
    }),
  ],
});
