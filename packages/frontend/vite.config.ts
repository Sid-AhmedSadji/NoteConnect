import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export default defineConfig(({ mode }) => ({
  base:'/',
  server: {
    host: "0.0.0.0",
    port: Number(process.env.VITE_PORT) || 5173,
    allowedHosts: process.env.VITE_ALLOWED_HOSTS ? process.env.VITE_ALLOWED_HOSTS.split(',') : [],
  },
  preview: {
    port: Number(process.env.VITE_PORT) || 8080, // Preview mode should use 8080
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'models': path.resolve(__dirname, '../../models'),
    },
  },
}));
