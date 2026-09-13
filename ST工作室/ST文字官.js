// ST文字官 – 颜色渐变 + 背景材质版
(function (Scratch) {
  'use strict';

  var TextManager = function (runtime) {
    this.runtime = runtime;
    this.root = null;
    this.tags = {}; // name -> { el, x, y, color, bgColor, hasBg, size, text, material }
  };

  TextManager.prototype.getInfo = function () {
    return {
      id: 'stTextManager',
      name: 'ST文字官',
      color1: '#FF9800',
      color2: '#F57C00',
      blocks: [
        // ---- 显示/创建 ----
        {
          opcode: 'showText',
          blockType: 'command',
          text: '显示文字 [NAME] 内容 [TEXT] 在 x:[X] y:[Y]',
          arguments: {
            NAME: { type: 'string', defaultValue: '标签1' },
            TEXT: { type: 'string', defaultValue: '你好' },
            X: { type: 'number', defaultValue: 0 },
            Y: { type: 'number', defaultValue: 0 }
          }
        },
        // ---- 更新内容 ----
        {
          opcode: 'updateText',
          blockType: 'command',
          text: '更新文字 [NAME] 内容为 [TEXT]',
          arguments: {
            NAME: { type: 'string', defaultValue: '标签1' },
            TEXT: { type: 'string', defaultValue: '新内容' }
          }
        },
        // ---- 隐藏 ----
        {
          opcode: 'hideText',
          blockType: 'command',
          text: '隐藏文字 [NAME]',
          arguments: { NAME: { type: 'string', defaultValue: '标签1' } }
        },
        // ---- 外观控制 ----
        {
          opcode: 'setPosition',
          blockType: 'command',
          text: '设置文字 [NAME] 位置为 x:[X] y:[Y]',
          arguments: {
            NAME: { type: 'string', defaultValue: '标签1' },
            X: { type: 'number', defaultValue: 0 },
            Y: { type: 'number', defaultValue: 0 }
          }
        },
        {
          opcode: 'setTextColor',
          blockType: 'command',
          text: '设置文字 [NAME] 颜色为 [COLOR]',
          arguments: {
            NAME: { type: 'string', defaultValue: '标签1' },
            COLOR: { type: 'string', menu: 'colorMenu', defaultValue: '#ffffff' }
          }
        },
        {
          opcode: 'setBgColor',
          blockType: 'command',
          text: '设置文字 [NAME] 背景颜色为 [COLOR]',
          arguments: {
            NAME: { type: 'string', defaultValue: '标签1' },
            COLOR: { type: 'string', menu: 'colorMenu', defaultValue: '#000000' }
          }
        },
        {
          opcode: 'setBgMaterial',
          blockType: 'command',
          text: '设置文字 [NAME] 背景材质为 [MATERIAL]',
          arguments: {
            NAME: { type: 'string', defaultValue: '标签1' },
            MATERIAL: { type: 'string', menu: 'materialMenu', defaultValue: '纯色' }
          }
        },
        {
          opcode: 'setBgVisible',
          blockType: 'command',
          text: '设置文字 [NAME] 显示背景 [VISIBLE]',
          arguments: {
            NAME: { type: 'string', defaultValue: '标签1' },
            VISIBLE: { type: 'string', menu: 'bgVisibleMenu', defaultValue: '有' }
          }
        },
        {
          opcode: 'setSize',
          blockType: 'command',
          text: '设置文字 [NAME] 大小为 [SIZE] 像素',
          arguments: {
            NAME: { type: 'string', defaultValue: '标签1' },
            SIZE: { type: 'number', defaultValue: 24 }
          }
        }
      ],
      menus: {
        colorMenu: {
          acceptReporters: false,
          items: [
            // 纯色
            { text: '白色', value: '#ffffff' },
            { text: '黑色', value: '#000000' },
            { text: '红色', value: '#ff0000' },
            { text: '绿色', value: '#00ff00' },
            { text: '蓝色', value: '#0000ff' },
            { text: '黄色', value: '#ffff00' },
            { text: '青色', value: '#00ffff' },
            { text: '品红', value: '#ff00ff' },
            { text: '橙色', value: '#ffa500' },
            { text: '紫色', value: '#800080' },
            { text: '灰色', value: '#808080' },
            { text: '粉色', value: '#ffc0cb' },
            { text: '棕色', value: '#a52a2a' },
            { text: '金色', value: '#ffd700' },
            { text: '深红', value: '#8b0000' },
            { text: '深绿', value: '#006400' },
            { text: '深蓝', value: '#00008b' },
            { text: '深紫', value: '#4b0082' },
            { text: '浅蓝', value: '#add8e6' },
            { text: '浅绿', value: '#90ee90' },
            { text: '浅粉', value: '#ffb6c1' },
            { text: '浅黄', value: '#ffffe0' },
            { text: '雪白', value: '#fffafa' },
            { text: '象牙', value: '#fffff0' },
            { text: '银白', value: '#c0c0c0' },
            { text: '暗灰', value: '#696969' },
            { text: '海军蓝', value: '#000080' },
            { text: '森林绿', value: '#228b22' },
            { text: '橄榄', value: '#808000' },
            { text: '珊瑚', value: '#ff7f50' },
            // 渐变色
            { text: '🌈 彩虹渐变', value: 'gradient-rainbow' },
            { text: '🔥 火焰渐变', value: 'gradient-fire' },
            { text: '🌊 海洋渐变', value: 'gradient-ocean' },
            { text: '🌅 夕阳渐变', value: 'gradient-sunset' },
            { text: '🌿 森林渐变', value: 'gradient-forest' }
          ]
        },
        materialMenu: {
          acceptReporters: false,
          items: [
            '纯色',
            '液态玻璃',
            '毛玻璃',
            '亚克力',
            '磨砂黑',
            '极光玻璃',
            '半透蓝',
            '深色玻璃'
          ]
        },
        bgVisibleMenu: {
          acceptReporters: false,
          items: ['有', '否']
        }
      }
    };
  };

  // ========== 渐变色 CSS 映射 ==========
  var GRADIENT_STYLES = {
    'gradient-rainbow': 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
    'gradient-fire': 'linear-gradient(45deg, #ff4e50, #f9d423)',
    'gradient-ocean': 'linear-gradient(135deg, #00b4db, #0083b0)',
    'gradient-sunset': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'gradient-forest': 'linear-gradient(135deg, #134e5e, #71b280)'
  };

  // ========== 材质 CSS 类名映射 ==========
  var MATERIAL_CLASSES = {
    '纯色': '',
    '液态玻璃': 'st-mat-liquid',
    '毛玻璃': 'st-mat-frosted',
    '亚克力': 'st-mat-acrylic',
    '磨砂黑': 'st-mat-matte-black',
    '极光玻璃': 'st-mat-aurora',
    '半透蓝': 'st-mat-semi-blue',
    '深色玻璃': 'st-mat-dark-glass'
  };

  // ========== 工具函数 ==========
  TextManager.prototype._ensureRoot = function () {
    if (!this.root || !this.root.isConnected) {
      this.root = document.createElement('div');
      this.root.id = 'st-text-manager-root';
      this.root.style.position = 'fixed';
      this.root.style.zIndex = '10000';
      this.root.style.pointerEvents = 'none';
      this.root.style.overflow = 'hidden';
      document.body.appendChild(this.root);
      this._updateRootBounds();
      // 注入材质样式
      this._injectStyles();
    }
    return this.root;
  };

  TextManager.prototype._injectStyles = function () {
    if (document.getElementById('st-text-master-styles')) return;
    var style = document.createElement('style');
    style.id = 'st-text-master-styles';
    style.textContent = `
      .st-mat-liquid {
        background: rgba(255,255,255,0.15) !important;
        backdrop-filter: blur(35px) saturate(180%) contrast(105%) brightness(1.05);
        -webkit-backdrop-filter: blur(35px) saturate(180%) contrast(105%) brightness(1.05);
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.1);
      }
      .st-mat-frosted {
        background: rgba(255,255,255,0.1) !important;
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border: 1px solid rgba(255,255,255,0.25);
      }
      .st-mat-acrylic {
        background: rgba(240,240,240,0.25) !important;
        backdrop-filter: blur(25px) saturate(120%) contrast(90%);
        -webkit-backdrop-filter: blur(25px) saturate(120%) contrast(90%);
        border: 1px solid rgba(255,255,255,0.3);
      }
      .st-mat-matte-black {
        background: rgba(20,20,20,0.9) !important;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .st-mat-aurora {
        background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(173,216,230,0.3) 50%, rgba(144,238,144,0.2) 100%) !important;
        backdrop-filter: blur(30px) saturate(200%) hue-rotate(20deg);
        -webkit-backdrop-filter: blur(30px) saturate(200%) hue-rotate(20deg);
        border: 1px solid rgba(255,255,255,0.6);
        box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.1);
      }
      .st-mat-semi-blue {
        background: rgba(30,144,255,0.3) !important;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.4);
      }
      .st-mat-dark-glass {
        background: rgba(0,0,0,0.35) !important;
        backdrop-filter: blur(30px) saturate(150%);
        -webkit-backdrop-filter: blur(30px) saturate(150%);
        border: 1px solid rgba(255,255,255,0.2);
      }
      /* 文字渐变需要 */
      .st-text-gradient {
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        color: transparent !important;
      }
    `;
    document.head.appendChild(style);
  };

  TextManager.prototype._updateRootBounds = function () {
    if (!this.root) return;
    var canvas = document.querySelector('.stage-wrapper canvas') || document.querySelector('canvas');
    var rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: 480, height: 360 };
    this.root.style.left = rect.left + 'px';
    this.root.style.top = rect.top + 'px';
    this.root.style.width = rect.width + 'px';
    this.root.style.height = rect.height + 'px';
    this.stageRect = rect;
    this.stageWidth = rect.width;
    this.stageHeight = rect.height;
    this.logicWidth = 480;
    this.logicHeight = 360;
    if (this.runtime) {
      try {
        var stage = this.runtime.getTargetForStage();
        if (stage && stage.getCostume) {
          var costume = stage.getCostume();
          if (costume) {
            this.logicWidth = costume.sizeX || 480;
            this.logicHeight = costume.sizeY || 360;
          }
        }
      } catch (e) {}
    }
  };

  TextManager.prototype._scratchToPixel = function (x, y) {
    var px = (x + this.logicWidth / 2) * (this.stageWidth / this.logicWidth);
    var py = (this.logicHeight / 2 - y) * (this.stageHeight / this.logicHeight);
    return { x: px, y: py };
  };

  TextManager.prototype._getOrCreateTag = function (name) {
    if (this.tags[name] && this.tags[name].el && this.tags[name].el.isConnected) {
      return this.tags[name];
    }
    var root = this._ensureRoot();
    var el = document.createElement('div');
    el.className = 'st-text-tag';
    el.style.position = 'absolute';
    el.style.whiteSpace = 'pre-wrap';
    el.style.wordBreak = 'break-word';
    el.style.pointerEvents = 'none';
    root.appendChild(el);
    var tag = {
      el: el,
      x: 0, y: 0,
      color: '#ffffff',
      bgColor: '#000000',
      hasBg: true,
      size: 24,
      text: '',
      material: '纯色'
    };
    this.tags[name] = tag;
    return tag;
  };

  TextManager.prototype._applyStyle = function (tag) {
    var el = tag.el;
    // 重置可能存在的渐变类
    el.classList.remove('st-text-gradient');
    // 文字颜色处理
    if (tag.color.startsWith('gradient-')) {
      // 渐变色
      var gradientCSS = GRADIENT_STYLES[tag.color] || GRADIENT_STYLES['gradient-rainbow'];
      el.style.background = gradientCSS;
      el.classList.add('st-text-gradient');
    } else {
      el.style.color = tag.color;
      el.style.background = '';
    }

    el.style.fontSize = tag.size + 'px';

    // 背景材质与背景颜色
    if (tag.hasBg) {
      el.style.padding = '4px 8px';
      el.style.borderRadius = '8px';
      // 移除所有材质类
      Object.values(MATERIAL_CLASSES).forEach(function(cls) {
        if (cls) el.classList.remove(cls);
      });
      if (tag.material === '纯色') {
        el.style.backgroundColor = tag.bgColor;
      } else {
        // 应用材质类
        var matCls = MATERIAL_CLASSES[tag.material] || '';
        if (matCls) el.classList.add(matCls);
        el.style.backgroundColor = ''; // 材质自带背景
      }
    } else {
      el.style.padding = '0';
      el.style.borderRadius = '0';
      el.style.backgroundColor = 'transparent';
      Object.values(MATERIAL_CLASSES).forEach(function(cls) {
        if (cls) el.classList.remove(cls);
      });
    }

    var pos = this._scratchToPixel(tag.x, tag.y);
    el.style.left = pos.x + 'px';
    el.style.top = pos.y + 'px';
    el.style.transform = 'translate(-50%, -50%)';
    el.textContent = tag.text || '';
  };

  // ========== 积木实现 ==========
  TextManager.prototype.showText = function (args) {
    var name = String(args.NAME);
    var tag = this._getOrCreateTag(name);
    tag.text = String(args.TEXT);
    tag.x = Number(args.X) || 0;
    tag.y = Number(args.Y) || 0;
    this._applyStyle(tag);
    tag.el.style.display = '';
    this._updateRootBounds();
  };

  TextManager.prototype.updateText = function (args) {
    var name = String(args.NAME);
    var tag = this.tags[name];
    if (!tag) return;
    tag.text = String(args.TEXT);
    this._applyStyle(tag);
  };

  TextManager.prototype.hideText = function (args) {
    var name = String(args.NAME);
    var tag = this.tags[name];
    if (tag && tag.el) {
      tag.el.style.display = 'none';
    }
  };

  TextManager.prototype.setPosition = function (args) {
    var name = String(args.NAME);
    var tag = this.tags[name];
    if (!tag) return;
    tag.x = Number(args.X) || 0;
    tag.y = Number(args.Y) || 0;
    this._applyStyle(tag);
  };

  TextManager.prototype.setTextColor = function (args) {
    var name = String(args.NAME);
    var tag = this.tags[name];
    if (!tag) return;
    tag.color = String(args.COLOR);
    this._applyStyle(tag);
  };

  TextManager.prototype.setBgColor = function (args) {
    var name = String(args.NAME);
    var tag = this.tags[name];
    if (!tag) return;
    tag.bgColor = String(args.COLOR);
    // 如果之前使用的是材质，这里会将背景颜色存储，但若材质不是纯色，背景颜色不会立即生效，只有切换回纯色才显示
    if (tag.material === '纯色') {
      this._applyStyle(tag);
    }
  };

  TextManager.prototype.setBgMaterial = function (args) {
    var name = String(args.NAME);
    var tag = this.tags[name];
    if (!tag) return;
    tag.material = String(args.MATERIAL);
    this._applyStyle(tag);
  };

  TextManager.prototype.setBgVisible = function (args) {
    var name = String(args.NAME);
    var tag = this.tags[name];
    if (!tag) return;
    tag.hasBg = (String(args.VISIBLE) === '有');
    this._applyStyle(tag);
  };

  TextManager.prototype.setSize = function (args) {
    var name = String(args.NAME);
    var tag = this.tags[name];
    if (!tag) return;
    tag.size = Math.max(1, Number(args.SIZE) || 24);
    this._applyStyle(tag);
  };

  Scratch.extensions.register(new TextManager());
})(Scratch);