// User permissions related operations
export function usePermission() {
    /**
     * Determine whether there is permission
     */
    function hasPermission(value, def = true) {
        // Visible by default
        if(!value) {
            return def;
        }

        return true;
    }

    return {
        hasPermission
    }
}