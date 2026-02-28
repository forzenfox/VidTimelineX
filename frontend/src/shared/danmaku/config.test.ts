/**
 * 弹幕配置管理模块单元测试
 */

import {
  THEME_COLORS,
  DANMAKU_TYPE_WEIGHTS,
  SIZE_THRESHOLDS,
  THEME_CONFIG_MAP,
  getThemeColors,
  getSizeLevel,
  getDanmakuWeight
} from './config';

describe('弹幕配置管理模块', () => {
  describe('THEME_COLORS 常量', () => {
    it('应该包含所有 6 个主题', () => {
      const expectedThemes = ['blood', 'mix', 'dongzhu', 'kaige', 'tiger', 'sweet'];
      expectedThemes.forEach(theme => {
        expect(THEME_COLORS).toHaveProperty(theme);
      });
    });

    it('每个主题应该包含 primary、secondary、accent 三种颜色', () => {
      Object.values(THEME_COLORS).forEach(config => {
        expect(config).toHaveProperty('primary');
        expect(config).toHaveProperty('secondary');
        expect(config).toHaveProperty('accent');
      });
    });

    it('所有颜色值应该是有效的十六进制颜色', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      Object.values(THEME_COLORS).forEach(config => {
        expect(hexColorRegex.test(config.primary)).toBe(true);
        expect(hexColorRegex.test(config.secondary)).toBe(true);
        expect(hexColorRegex.test(config.accent)).toBe(true);
      });
    });

    it('blood 主题颜色应该正确', () => {
      expect(THEME_COLORS.blood.primary).toBe('#FF4444');
      expect(THEME_COLORS.blood.secondary).toBe('#FF8888');
      expect(THEME_COLORS.blood.accent).toBe('#CC0000');
    });

    it('sweet 主题颜色应该正确', () => {
      expect(THEME_COLORS.sweet.primary).toBe('#FF69B4');
      expect(THEME_COLORS.sweet.secondary).toBe('#FFB6C1');
      expect(THEME_COLORS.sweet.accent).toBe('#FF1493');
    });
  });

  describe('DANMAKU_TYPE_WEIGHTS 常量', () => {
    it('应该包含所有弹幕类型', () => {
      const expectedTypes = ['normal', 'top', 'bottom', 'special', 'premium'];
      expectedTypes.forEach(type => {
        expect(DANMAKU_TYPE_WEIGHTS).toHaveProperty(type);
      });
    });

    it('权重值应该正确', () => {
      expect(DANMAKU_TYPE_WEIGHTS.normal).toBe(1);
      expect(DANMAKU_TYPE_WEIGHTS.top).toBe(2);
      expect(DANMAKU_TYPE_WEIGHTS.bottom).toBe(2);
      expect(DANMAKU_TYPE_WEIGHTS.special).toBe(3);
      expect(DANMAKU_TYPE_WEIGHTS.premium).toBe(4);
    });

    it('权重值应该递增', () => {
      expect(DANMAKU_TYPE_WEIGHTS.premium).toBeGreaterThan(DANMAKU_TYPE_WEIGHTS.special);
      expect(DANMAKU_TYPE_WEIGHTS.special).toBeGreaterThan(DANMAKU_TYPE_WEIGHTS.top);
      expect(DANMAKU_TYPE_WEIGHTS.top).toBeGreaterThanOrEqual(DANMAKU_TYPE_WEIGHTS.normal);
    });
  });

  describe('SIZE_THRESHOLDS 常量', () => {
    it('应该包含 small 和 medium 阈值', () => {
      expect(SIZE_THRESHOLDS).toHaveProperty('small');
      expect(SIZE_THRESHOLDS).toHaveProperty('medium');
    });

    it('阈值应该正确', () => {
      expect(SIZE_THRESHOLDS.small).toBe(8);
      expect(SIZE_THRESHOLDS.medium).toBe(4);
    });

    it('small 阈值应该大于 medium 阈值', () => {
      expect(SIZE_THRESHOLDS.small).toBeGreaterThan(SIZE_THRESHOLDS.medium);
    });
  });

  describe('THEME_CONFIG_MAP 映射表', () => {
    it('应该包含所有主题', () => {
      const expectedThemes = ['blood', 'mix', 'dongzhu', 'kaige', 'tiger', 'sweet'];
      expectedThemes.forEach(theme => {
        expect(THEME_CONFIG_MAP).toHaveProperty(theme);
      });
    });

    it('每个主题的配置应该与 THEME_COLORS 中的一致', () => {
      Object.keys(THEME_CONFIG_MAP).forEach(theme => {
        expect(THEME_CONFIG_MAP[theme]).toEqual(THEME_COLORS[theme]);
      });
    });
  });

  describe('getThemeColors 函数', () => {
    it('应该返回指定主题的颜色配置', () => {
      const bloodColors = getThemeColors('blood');
      expect(bloodColors).toEqual(THEME_COLORS.blood);
    });

    it('当主题不存在时应该返回默认的 mix 主题配置', () => {
      const defaultColors = getThemeColors('nonexistent');
      expect(defaultColors).toEqual(THEME_COLORS.mix);
    });

    it('应该返回正确的颜色值', () => {
      const dongzhuColors = getThemeColors('dongzhu');
      expect(dongzhuColors.primary).toBe('#3498DB');
      expect(dongzhuColors.secondary).toBe('#85C1E9');
      expect(dongzhuColors.accent).toBe('#2980B9');
    });
  });

  describe('getSizeLevel 函数', () => {
    it('大于 8 的值应该返回 small', () => {
      expect(getSizeLevel(9)).toBe('small');
      expect(getSizeLevel(10)).toBe('small');
      expect(getSizeLevel(100)).toBe('small');
    });

    it('4 到 8 之间的值应该返回 medium', () => {
      expect(getSizeLevel(5)).toBe('medium');
      expect(getSizeLevel(6)).toBe('medium');
      expect(getSizeLevel(7)).toBe('medium');
      expect(getSizeLevel(8)).toBe('medium');
    });

    it('小于等于 3 的值应该返回 large', () => {
      expect(getSizeLevel(1)).toBe('large');
      expect(getSizeLevel(2)).toBe('large');
      expect(getSizeLevel(3)).toBe('large');
      expect(getSizeLevel(0)).toBe('large');
      expect(getSizeLevel(-1)).toBe('large');
    });

    it('边界值应该正确', () => {
      expect(getSizeLevel(3)).toBe('large');
      expect(getSizeLevel(4)).toBe('large');
      expect(getSizeLevel(5)).toBe('medium');
      expect(getSizeLevel(8)).toBe('medium');
      expect(getSizeLevel(9)).toBe('small');
    });
  });

  describe('getDanmakuWeight 函数', () => {
    it('应该返回指定类型的权重值', () => {
      expect(getDanmakuWeight('normal')).toBe(1);
      expect(getDanmakuWeight('top')).toBe(2);
      expect(getDanmakuWeight('bottom')).toBe(2);
      expect(getDanmakuWeight('special')).toBe(3);
      expect(getDanmakuWeight('premium')).toBe(4);
    });

    it('当类型不存在时应该返回普通弹幕的权重', () => {
      expect(getDanmakuWeight('nonexistent')).toBe(1);
    });
  });
});
