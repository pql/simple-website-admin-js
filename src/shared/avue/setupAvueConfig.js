import axios from 'axios';
import { router } from "@/shared/router/setupRouter";
import { registerConfig } from '@/index';

export function setupAvueConfig() {
    const opts = {
        config: {
            keys: 'U2FsdGVkX1/xwwqTGwCNbGISEw82wbNp36+2zwR/YUW4Amq7JveW82c0nzxy3qUFCRzd96pakLxVVfWlkxX//k8GhH2SenwJ+ENZ9xqTeSC+GjfM3PCi2hGhe9jpwiPa'
        },
        router,
        axios
    }
    registerConfig(opts);
}