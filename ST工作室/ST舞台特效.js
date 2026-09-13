// ST舞台特效 - 实时滤镜控制
(function (Scratch) {
  'use strict';

  class StageEffects {
    constructor() {
      // 滤镜参数对象
      this.filters = {
        brightness: 100,      // 亮度 %
        contrast: 100,        // 对比度 %
        saturation: 100,      // 饱和度 %
        blur: 0,              // 模糊 px
        hueRotate: 0,         // 色相旋转 deg
        grayscale: 0,         // 灰度 %
        sepia: 0,             // 复古 %
        invert: 0,            // 反色 %
        opacity: 100          // 不透明度 %
      };
      this.enabled = true;
      this.targetElement = null;
    }

    getInfo() {
      return {
        id: 'stStageEffects',
        name: 'ST舞台特效',
        color1: '#9C27B0',
        color2: '#6A1B9A',
        blocks: [
          {
            opcode: 'applyPreset',
            blockType: 'command',
            text: '应用预设 [PRESET]',
            arguments: {
              PRESET: {
                type: 'string',
                menu: 'presetMenu',
                defaultValue: '无'
              }
            }
          },
          {
            opcode: 'setBrightness',
            blockType: 'command',
            text: '设置亮度 [VALUE] %',
            arguments: { VALUE: { type: 'number', defaultValue: 100 } }
          },
          {
            opcode: 'setContrast',
            blockType: 'command',
            text: '设置对比度 [VALUE] %',
            arguments: { VALUE: { type: 'number', defaultValue: 100 } }
          },
          {
            opcode: 'setSaturation',
            blockType: 'command',
            text: '设置饱和度 [VALUE] %',
            arguments: { VALUE: { type: 'number', defaultValue: 100 } }
          },
          {
            opcode: 'setBlur',
            blockType: 'command',
            text: '设置模糊 [VALUE] 像素',
            arguments: { VALUE: { type: 'number', defaultValue: 0 } }
          },
          {
            opcode: 'setHueRotate',
            blockType: 'command',
            text: '设置色相旋转 [VALUE] 度',
            arguments: { VALUE: { type: 'number', defaultValue: 0 } }
          },
          {
            opcode: 'setGrayscale',
            blockType: 'command',
            text: '设置灰度 [VALUE] %',
            arguments: { VALUE: { type: 'number', defaultValue: 0 } }
          },
          {
            opcode: 'setSepia',
            blockType: 'command',
            text: '设置复古 [VALUE] %',
            arguments: { VALUE: { type: 'number', defaultValue: 0 } }
          },
          {
            opcode: 'setInvert',
            blockType: 'command',
            text: '设置反色 [VALUE] %',
            arguments: { VALUE: { type: 'number', defaultValue: 0 } }
          },
          {
            opcode: 'setOpacity',
            blockType: 'command',
            text: '设置不透明度 [VALUE] %',
            arguments: { VALUE: { type: 'number', defaultValue: 100 } }
          },
          {
            opcode: 'clearEffects',
            blockType: 'command',
            text: '清除所有特效'
          },
          {
            opcode: 'setEnabled',
            blockType: 'command',
            text: '设置特效启用 [ENABLED]',
            arguments: { ENABLED: { type: 'Boolean', defaultValue: true } }
          },
          {
            opcode: 'getFilterString',
            blockType: 'reporter',
            text: '获取当前滤镜字符串'
          }
        ],
        menus: {
          presetMenu: [
            '无',
            '模糊',
            '灰度',
            '复古',
            '反色',
            '高对比度',
            '低对比度',
            '暖色',
            '冷色',
            '清晰锐化',
            '暗角',
            '梦幻'
          ]
        }
      };
    }

    // 获取目标元素（舞台画布）
    _getTargetElement() {
      if (this.targetElement && this.targetElement.isConnected) {
        return this.targetElement;
      }
      // 优先尝试舞台画布
      let canvas = document.querySelector('.stage-wrapper canvas');
      if (!canvas) {
        const canvases = document.querySelectorAll('canvas');
        let maxArea = 0;
        canvases.forEach(c => {
          const area = c.width * c.height;
          if (area > maxArea) {
            maxArea = area;
            canvas = c;
          }
        });
      }
      this.targetElement = canvas;
      return canvas;
    }

    // 应用预设
    applyPreset(args) {
      const preset = String(args.PRESET);
      this._resetFilters();
      switch (preset) {
        case '模糊':
          this.filters.blur = 8;
          break;
        case '灰度':
          this.filters.grayscale = 100;
          break;
        case '复古':
          this.filters.sepia = 60;
          this.filters.contrast = 110;
          this.filters.brightness = 90;
          break;
        case '反色':
          this.filters.invert = 100;
          break;
        case '高对比度':
          this.filters.contrast = 150;
          break;
        case '低对比度':
          this.filters.contrast = 70;
          break;
        case '暖色':
          this.filters.sepia = 30;
          this.filters.saturation = 120;
          this.filters.brightness = 105;
          break;
        case '冷色':
          this.filters.hueRotate = 180;
          this.filters.saturation = 90;
          break;
        case '清晰锐化':
          this.filters.contrast = 120;
          this.filters.brightness = 105;
          break;
        case '暗角':
          // 暗角使用径向渐变叠加，非CSS filter，扩展不支持，但可用其他方式：这里用亮度+对比度模拟
          this.filters.brightness = 80;
          this.filters.contrast = 110;
          break;
        case '梦幻':
          this.filters.blur = 1;
          this.filters.saturation = 150;
          this.filters.brightness = 110;
          break;
        case '无':
        default:
          // 默认无特效，已重置
          break;
      }
      this._applyFilter();
    }

    // 重置所有滤镜参数到默认
    _resetFilters() {
      this.filters.brightness = 100;
      this.filters.contrast = 100;
      this.filters.saturation = 100;
      this.filters.blur = 0;
      this.filters.hueRotate = 0;
      this.filters.grayscale = 0;
      this.filters.sepia = 0;
      this.filters.invert = 0;
      this.filters.opacity = 100;
    }

    // 生成CSS filter字符串
    _buildFilterString() {
      if (!this.enabled) return 'none';
      let parts = [];
      if (this.filters.brightness !== 100) parts.push(`brightness(${this.filters.brightness}%)`);
      if (this.filters.contrast !== 100) parts.push(`contrast(${this.filters.contrast}%)`);
      if (this.filters.saturation !== 100) parts.push(`saturate(${this.filters.saturation}%)`);
      if (this.filters.blur > 0) parts.push(`blur(${this.filters.blur}px)`);
      if (this.filters.hueRotate !== 0) parts.push(`hue-rotate(${this.filters.hueRotate}deg)`);
      if (this.filters.grayscale > 0) parts.push(`grayscale(${this.filters.grayscale}%)`);
      if (this.filters.sepia > 0) parts.push(`sepia(${this.filters.sepia}%)`);
      if (this.filters.invert > 0) parts.push(`invert(${this.filters.invert}%)`);
      if (this.filters.opacity !== 100) parts.push(`opacity(${this.filters.opacity}%)`);
      return parts.length > 0 ? parts.join(' ') : 'none';
    }

    // 应用滤镜到目标元素
    _applyFilter() {
      const target = this._getTargetElement();
      if (!target) return;
      const filterString = this._buildFilterString();
      target.style.filter = filterString;
      target.style.webkitFilter = filterString; // 兼容
    }

    // 各参数设置积木
    setBrightness(args) { this.filters.brightness = Math.max(0, Number(args.VALUE) || 100); this._applyFilter(); }
    setContrast(args) { this.filters.contrast = Math.max(0, Number(args.VALUE) || 100); this._applyFilter(); }
    setSaturation(args) { this.filters.saturation = Math.max(0, Number(args.VALUE) || 100); this._applyFilter(); }
    setBlur(args) { this.filters.blur = Math.max(0, Number(args.VALUE) || 0); this._applyFilter(); }
    setHueRotate(args) { this.filters.hueRotate = Number(args.VALUE) || 0; this._applyFilter(); }
    setGrayscale(args) { this.filters.grayscale = Math.max(0, Math.min(100, Number(args.VALUE) || 0)); this._applyFilter(); }
    setSepia(args) { this.filters.sepia = Math.max(0, Math.min(100, Number(args.VALUE) || 0)); this._applyFilter(); }
    setInvert(args) { this.filters.invert = Math.max(0, Math.min(100, Number(args.VALUE) || 0)); this._applyFilter(); }
    setOpacity(args) { this.filters.opacity = Math.max(0, Math.min(100, Number(args.VALUE) || 100)); this._applyFilter(); }

    clearEffects() {
      this._resetFilters();
      this._applyFilter();
    }

    setEnabled(args) {
      this.enabled = Boolean(args.ENABLED);
      this._applyFilter();
    }

    getFilterString() {
      return this._buildFilterString();
    }
  }

  Scratch.extensions.register(new StageEffects());
})(Scratch);