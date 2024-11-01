import { getApplicationConfig } from '@/shared/config/application';

export const run = async (callback) => {
    // get application configuration
    getApplicationConfig();
    callback();
};

export default run;