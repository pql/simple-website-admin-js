import { CACHE_TYPE_ENUM } from '@/shared/enums/cache';
import {
  SESSION_TIMEOUT_PROCESSING_ENUM,
  ROUTER_TRANSITION_ENUM,
  PERMISSION_MODE_ENUM,
  THEME_ENUM,
  SETTING_BUTTON_POSITION_ENUM,
  CONTENT_ENUM,
} from '@/shared/enums/app';
import {
  MENU_TYPE_ENUM, MENU_MODE_ENUM,
  TRIGGER_ENUM,
  MIX_SIDEBAR_TRIGGER_ENUM
} from '@/shared/enums/menu';
import {
  SIDE_BAR_BG_COLOR_LIST,
  HEADER_PRESET_BG_COLOR_LIST,
  APP_PRESET_COLOR_LIST
} from './designSetting';

// ! You need to clear the browser cache after the change
const settings = {
  // Whether to show the configuration button
  showSettingButton: true,

  // Whether to show the theme switch button
  showDarkModeToggle: true,

  // `Settings` button position
  settingButtonPosition: SETTING_BUTTON_POSITION_ENUM.AUTO,

  // Permission mode
  permissionMode: PERMISSION_MODE_ENUM.ROUTE_MAPPING,

  // Permission-related cache is stored in sessionStorage or localStorage
  permissionCacheType: CACHE_TYPE_ENUM.LOCAL,

  // Session timeout processing
  sessionTimeoutProcessing: SESSION_TIMEOUT_PROCESSING_ENUM.ROUTE_JUMP,

  // color
  themeColor: APP_PRESET_COLOR_LIST[0],

  // Website gray mode, open for possible mourning dates
  grayMode: false,

  // Color Weakness Mode
  colorWeak: false,

  // Whether to cancel the menu, the top, the multi-tab page display, for possible embedded in other systems
  fullContent: false,

  // content mode
  contentMode: CONTENT_ENUM.FULL,

  // Whether to display the logo
  showLogo: true,
  // Whether to show footer
  showFooter: false,

  // Header configuration
  headerSetting: {
    // header bg color
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // Fixed at the top
    fixed: true,
    // Whether to show top
    show: true,
    // theme
    theme: THEME_ENUM.DARK,
    // Whether to enable the lock screen function
    useLockPage: false,
    // Whether to show the full screen button
    showFullScreen: true,
    // Whether to show the document button
    showDoc: false,
    // Whether to show the notification button
    showNotice: false,
    // Whether to display the menu search
    showSearch: false,
    showApi: false,
  },

  // Menu configuration
  menuSetting: {
    // sidebar menu bg color
    bgColor: SIDE_BAR_BG_COLOR_LIST[0],
    //  Whether to fix the left menu
    fixed: true,
    // Menu collapse
    collapsed: false,
    // When sider hide because of the responsive layout
    siderHidden: false,
    // Whether to display the menu name when folding the menu
    collapsedShowTitle: false,
    // Whether it can be dragged
    // Only limited to the opening of the left menu, the mouse has a drag bar on the right side of the menu
    canDrag: false,
    // Whether to show no dom
    show: true,
    // Whether to show dom
    hidden: false,
    // Menu width
    menuWidth: 260,
    // Menu mode
    mode: MENU_MODE_ENUM.INLINE,
    // Menu type
    type: MENU_TYPE_ENUM.SIDEBAR,
    // Menu theme
    theme: THEME_ENUM.DARK,
    // Split menu
    split: false,
    // Top menu layout
    topMenuAlign: 'center',
    // Fold trigger position
    trigger: TRIGGER_ENUM.HEADER,
    // Turn on accordion mode, only show a menu
    accordion: true,
    // Switch page to close menu
    closeMixSidebarOnChange: false,
    // Module opening method ‘click’ |'hover'
    mixSideTrigger: MIX_SIDEBAR_TRIGGER_ENUM.CLICK,
    // Fixed expanded menu
    mixSideFixed: false,
  },

  // Multi-label
  multiTabsSetting: {
    cache: true,
    // Turn on
    show: true,
    // Is it possible to drag and drop sorting tabs
    canDrag: true,
    // Turn on quick actions
    showQuick: true,
    // Whether to show the refresh button
    showRedo: true,
    // Whether to show the collapse button
    showFold: true,
    // Auto collapsed
    autoCollapse: false,
  },

  // Animation configuration
  transitionSetting: {
    //  Whether to open the page switching animation
    // The disabled state will also disable pageLoading
    enable: true,

    // Route basic switching animation
    basicTransition: ROUTER_TRANSITION_ENUM.FADE_SIDE,

    // Whether to open page switching loading
    // Only open when enable=true
    openPageLoading: true,

    // Whether to open the top progress bar
    openNProgress: true,
  },

  // Whether to enable KeepAlive cache is best to close during development, otherwise the cache needs to be cleared every time
  openKeepAlive: true,

  // Automatic screen lock time, 0 does not lock the screen. Unit minute default 0
  lockTime: 0,

  // Whether to show breadcrumbs
  showBreadCrumb: false,

  // Whether to show the breadcrumb icon
  showBreadCrumbIcon: false,

  // Use error-handler-plugin
  useErrorHandle: true,

  // Whether to open back to top
  useOpenBackTop: true,

  //  Is it possible to embed iframe pages
  canEmbedIFramePage: true,

  // Whether to delete unclosed messages and notify when switching the interface
  closeMessageOnSwitch: true,

  // Whether to cancel the http request that has been sent but not responded when switching the interface.
  // If it is enabled, I want to overwrite a single interface. Can be set in a separate interface
  removeAllHttpPending: false,
}

export default settings;