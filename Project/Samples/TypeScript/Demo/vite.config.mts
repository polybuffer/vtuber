import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import path from 'path';
import fs from 'fs';

export default defineConfig((env: ConfigEnv): UserConfig => {
  let common: UserConfig = {
    server: {
      port: 5000,
      https: {
        key: fs.readFileSync('ssl/key.pem'),
        cert: fs.readFileSync('ssl/cert.pem'),
      },
      host: true,
    },
    root: './',
    base: '/',
    publicDir: './public',
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@framework': path.resolve(__dirname, '../../../Framework/src'),
      }
    },
    build: {
      target: 'modules',
      assetsDir: 'assets',
      outDir: './dist',
      sourcemap: env.mode == 'development' ? true : false,
    },
  };
  return common;
});
