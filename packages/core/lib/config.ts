import { Config } from './types';

let config: Config = undefined;

export function getConfig(): Config {
  return config;
}

export function setConfig(newConfig: Config) {
  config = newConfig;
}
