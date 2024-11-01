/**
 * Configure and register global directives
 */
import { setupPermissionDirective } from './permission';
// import { setupLoadingDirective } from './loading';
import { setupEllipsisDirective } from './ellipsis';

const setupGlobDirectives = () => {
    setupPermissionDirective();
    // setupLoadingDirective();
    setupEllipsisDirective();
}

export default setupGlobDirectives;