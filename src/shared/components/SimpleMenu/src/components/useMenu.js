import { computed, unref } from 'vue';

/**
 * 
 * @param {ComponentInternalInstance | null} instance
 */
export function useMenuItem(instance) {
    const getParentMenu = computed(() => {
        return findParentMenu(['Menu', 'SubMenu']);
    });

    const getParentRootMenu = computed(() => {
        return findParentMenu(['Menu']);
    });

    const getParentSubMenu = computed(() => {
        return findParentMenu(['SubMenu']);
    });

    const getItemStyle = computed(() => {
        let parent = instance && instance.proxy.parent;
        if (!parent) return {};
        const indentSize = (unref(getParentRootMenu) && unref(getParentRootMenu).props.indentSize) || 20;
        let padding = indentSize + 15;


        if (unref(getParentRootMenu) && unref(getParentRootMenu).props.collapse) {
            padding = indentSize;
        } else {
            while (parent && parent.type.name !== 'Menu') {
                if (parent.type.name === 'SubMenu') {
                    padding += indentSize;
                }
                parent = parent.parent;
            }
        }
        return {
            paddingLeft: padding + 'px'
        };
    });


    /**
     * @param {string[]} name 
     */
    function findParentMenu(name) {
        let parent = instance && instance.proxy.parent;
        while (parent && name.indexOf(parent.type.name) === -1) {
            parent = parent.parent;
        }
        return parent
    }

    function getParentList() {
        let parent = instance.proxy;
        if (!parent) {
            return {
                uidList: [],
                list: [],
            }
        }
        const ret = [];
        while (parent && parent.type.name !== 'Menu') {
            if (parent.type.name === 'SubMenu') {
                ret.push(parent);
            }
            parent = parent.parent;
        }
        return {
            uidList: ret.map((item) => item.uid),
            list: ret,
        }
    }

    function getParentInstance(instance, name = 'SubMenu') {
        let parent = instance.proxy.parent;
        while (parent) {
            if (parent.type.name !== name) {
                return parent;
            }
            parent = parent.parent;
        }
        return parent;
    }

    return {
        getParentMenu,
        getParentInstance,
        getParentRootMenu,
        getParentList,
        getParentSubMenu,
        getItemStyle,
    }
}