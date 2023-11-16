import pluginJson from './plugin.json';

export const PLUGIN_BASE_URL = `/a/${pluginJson.id}`;

export enum ROUTES {
  One = 'one',
  Two = 'two',
  Three = 'three',
  Four = 'four',
}

export enum MULTIFORM_PROPERTIES {
  GRANT_TYPE = 'password',
  CLIENT_ID = 'cyclosoft',
  CLIENT_SECRET = 'def2edf7-5d42-4edc-a84a-30136c340e13',
  SCOPE = 'admin-api',
}
