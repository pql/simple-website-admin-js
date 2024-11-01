import { computed } from 'vue';
import { theme } from 'ant-design-vue';
import { useRootSetting } from '@/shared/hooks/setting/useRootSetting';
import { THEME_ENUM } from '@/shared/enums/app';

export function useDarkModeTheme() {
  const { getDarkMode } = useRootSetting();
  const { darkAlgorithm } = theme;
  const isDark = computed(() => getDarkMode.value === THEME_ENUM.DARK);
  const darkTheme = {
    algorithm: [darkAlgorithm],
  };

  return {
    isDark,
    darkTheme,
  };
}
