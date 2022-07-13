import { resolve } from 'path';
import { merge } from 'webpack-merge';
import webpack, { Configuration as WpConfig, Configuration } from 'webpack';
import { Configuration as WdsConfig } from 'webpack-dev-server';

import sharedConfig from './webpack.shared';
import { APP_CONFIG } from '../app.config';

const { FOLDERS } = APP_CONFIG;

const config: Configuration = merge<WpConfig & WdsConfig>(sharedConfig, {
  mode: 'production',
  target: 'electron-main',

  entry: {
    main: resolve(FOLDERS.ENTRY_POINTS.MAIN),
    bridge: resolve(FOLDERS.ENTRY_POINTS.BRIDGE),
  },

  output: {
    path: resolve(FOLDERS.DEV_BUILD),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'swc-loader',
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),
  ],
});

export default config;
