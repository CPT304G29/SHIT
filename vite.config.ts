import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { codecovVitePlugin } from "@codecov/vite-plugin";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "<bundle project name>",
      uploadToken: process.env.CODECOV_TOKEN,
    }),],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
