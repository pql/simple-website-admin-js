/**
 * @description: menu type
 */
export const MENU_TYPE_ENUM = {
    // left menu
    SIDEBAR: 'sidebar',

    MIX_SIDEBAR: 'mix-sidebar',
    // mixin menu
    MIX: 'mix',
    // top menu
    TOP_MENU: 'top-menu',
}

// 折叠触发器位置
export const TRIGGER_ENUM = {
    // 不显示
    NONE: 'NONE',
    // 菜单底部
    FOOTER: 'FOOTER',
    // 头部
    HEADER: 'HEADER',
}

// menu mode
export const MENU_MODE_ENUM = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
    VERTICAL_RIGHT: 'vertical-right',
    INLINE: 'inline',
}

export const MENU_SPLIT_TYPE_ENUM = {
    NONE: 0,
    TOP: 1,
    LEFT: 2
};

export const TOP_MENU_ALIGN_ENUM = {
    CENTER: 'center',
    START: 'start',
    END: 'end',
}

export const MIX_SIDEBAR_TRIGGER_ENUM = {
    HOVER: 'hover',
    CLICK: 'click',
}