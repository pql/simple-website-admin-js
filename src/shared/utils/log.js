import { getAppEnvConfig } from '@/shared/utils/env';

const { VUE_APP_GLOB_TITLE: projectName } = getAppEnvConfig();

export function warn(message) {
    console.warn(`[${projectName} warn]:${message}`);
}

export function error(message) {
    throw new Error(`[${projectName} error]:${message}`);
}
