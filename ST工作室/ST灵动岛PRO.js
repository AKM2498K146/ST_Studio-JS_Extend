// ST灵动岛 Pro – 进度条空闲消失版
(function (Scratch) {
  'use strict';

  const MATERIAL_MAP = {
    '🌑 纯黑': 'st-black',
    '💧 液态玻璃': 'st-liquid-glass',
    '🧊 亚克力': 'st-acrylic',
    '🌫️ 毛玻璃': 'st-frosted',
    '⬜ 纯白': 'st-white',
    '🔴 纯红': 'st-red',
    '🖤 磨砂黑': 'st-matte-black',
    '💎 半透蓝': 'st-semi-blue',
    '🌟 渐变金': 'st-gradient-gold',
    '🌃 深色玻璃': 'st-dark-glass',
    '🌈 极光玻璃': 'st-aurora-glass',
    '☁️ 浅灰': 'st-light-gray',
    '🦋 浅蓝': 'st-light-blue',
    '🍃 浅绿': 'st-light-green'
  };

  const ANIMATIONS = {
    '✨ Q弹进入': { type: 'bounce' },
    '⬅️ 左侧滑入': { type: 'slide', direction: 'left' },
    '➡️ 右侧滑入': { type: 'slide', direction: 'right' },
    '⬇️ 上方坠入': { type: 'drop' },
    '🔄 翻转进入': { type: 'flip' },
    '🔍 缩放进入': { type: 'zoom' }
  };

  const PROGRESS_STYLES = {
    '经典绿': 'st-progress-green',
    '海蓝': 'st-progress-blue',
    '活力橙': 'st-progress-orange',
    '优雅紫': 'st-progress-purple',
    '彩虹渐变': 'st-progress-rainbow',
    '粗条深色': 'st-progress-thick'
  };

  class PopupStack {
    constructor(gap, initialOffset, cssVar, exitClass = 'st-exit-up', exitDuration = 400) {
      this.items = [];
      this.gap = gap;
      this.initialOffset = initialOffset;
      this.cssVar = cssVar;
      this.exitClass = exitClass;
      this.exitDuration = exitDuration;
      this.alignX = 'center';
      this.offsetX = 0;
    }

    add(el, duration, autoRemove = true) {
      const id = Date.now() + Math.random();
      let timer = null;
      if (autoRemove) timer = setTimeout(() => this.remove(id), duration * 1000);
      this.items.push({ el, timer, id, exiting: false });
      requestAnimationFrame(() => this._layout());
      return () => this.remove(id);
    }

    remove(id) {
      const idx = this.items.findIndex(i => i.id === id);
      if (idx === -1) return;
      const item = this.items[idx];
      if (item.exiting) return;
      item.exiting = true;
      clearTimeout(item.timer);
      item.el.classList.add(this.exitClass);
      setTimeout(() => {
        if (item.el.parentNode) item.el.remove();
        const currentIdx = this.items.findIndex(i => i.id === id);
        if (currentIdx !== -1) {
          this.items.splice(currentIdx, 1);
          requestAnimationFrame(() => this._layout());
        }
      }, this.exitDuration);
    }

    clear() {
      this.items.forEach(item => {
        clearTimeout(item.timer);
        if (item.el.parentNode) item.el.remove();
      });
      this.items = [];
    }

    setGap(gap) { this.gap = gap; this._layout(); }
    setInitialOffset(offset) { this.initialOffset = offset; this._layout(); }
    setAlignX(align) { this.alignX = align; this._layout(); }
    setOffsetX(val) { this.offsetX = val; this._layout(); }

    _layout() {
      let currentY = this.initialOffset;
      this.items.forEach((item) => {
        if (item.exiting) return;
        const height = item.el.getBoundingClientRect().height || 50;
        if (this.alignX === 'left') {
          item.el.style.left = (20 + this.offsetX) + 'px';
          item.el.style.right = 'auto';
          item.el.style.transform = 'translate(0, var(--y))';
        } else if (this.alignX === 'right') {
          item.el.style.right = (20 + this.offsetX) + 'px';
          item.el.style.left = 'auto';
          item.el.style.transform = 'translate(0, var(--y))';
        } else {
          item.el.style.left = (50 + this.offsetX) + '%';
          item.el.style.right = 'auto';
          item.el.style.transform = 'translate(-50%, var(--y))';
        }
        item.el.style.setProperty(this.cssVar, currentY + 'px');
        currentY += height + this.gap;
      });
    }
  }

  class GroupConfig {
    constructor(name, runtime) {
      this.name = name;
      this.runtime = runtime;
      this.material = '🌑 纯黑';
      this.animation = '✨ Q弹进入';
      this.positionPreset = '📍 中上';
      this.offsetX = 0;
      this.offsetY = 36;
      this.stack = new PopupStack(8, 36, '--y', 'st-exit-up', 400);
      this._applyPosition();
    }

    _applyPosition() {
      const s = this.stack;
      const stageHeight = this._getStageHeight();
      switch (this.positionPreset) {
        case '↖️ 左上': s.setAlignX('left'); s.setInitialOffset(stageHeight * 0.1); s.setOffsetX(10); break;
        case '↗️ 右上': s.setAlignX('right'); s.setInitialOffset(stageHeight * 0.1); s.setOffsetX(10); break;
        case '⬅️ 左中': s.setAlignX('left'); s.setInitialOffset(stageHeight * 0.5); s.setOffsetX(10); break;
        case '➡️ 右中': s.setAlignX('right'); s.setInitialOffset(stageHeight * 0.5); s.setOffsetX(10); break;
        case '↙️ 左下': s.setAlignX('left'); s.setInitialOffset(stageHeight * 0.9); s.setOffsetX(10); break;
        case '↘️ 右下': s.setAlignX('right'); s.setInitialOffset(stageHeight * 0.9); s.setOffsetX(10); break;
        case '✏️ 自定义': s.setAlignX('center'); s.setInitialOffset(this.offsetY); s.setOffsetX(this.offsetX); break;
        case '📍 中上':
        default: s.setAlignX('center'); s.setInitialOffset(this.offsetY); s.setOffsetX(this.offsetX); break;
      }
    }

    _getStageHeight() {
      try {
        if (this.runtime) {
          const stage = this.runtime.getTargetForStage();
          if (stage && stage.getCostume) {
            const costume = stage.getCostume();
            if (costume && costume.sizeY) return costume.sizeY;
          }
        }
      } catch (e) {}
      const canvas = document.querySelector('.stage-wrapper canvas') || document.querySelector('canvas');
      if (canvas) return canvas.height || 360;
      return 360;
    }

    updatePosition(preset) {
      this.positionPreset = preset;
      this._applyPosition();
      this.stack._layout();
    }
    setOffset(x, y) {
      this.offsetX = x;
      this.offsetY = y;
      if (this.positionPreset === '✏️ 自定义' || this.positionPreset === '📍 中上') {
        this._applyPosition();
        this.stack._layout();
      }
    }
  }

  class StDynamicIslandPro {
    constructor() {
      this.runtime = null;
      this.groups = {};
      this.root = null;
      this._progressItems = {}; // 名字 → { el, removeFn, timerId, progressValue, idleDuration }
    }

    getInfo() {
      return {
        id: 'stDynamicIslandPro',
        name: '✨ ST灵动岛Pro',
        color1: '#7C4DFF',
        color2: '#5C2DB0',
        blocks: [
          {
            opcode: 'setGroupProps',
            blockType: 'command',
            text: '⚙️ 设置组 [GROUP] 材质 [MATERIAL] 位置 [POS] 动画 [ANIM]',
            arguments: {
              GROUP: { type: 'string', defaultValue: '默认' },
              MATERIAL: { type: 'string', menu: 'materialMenu', defaultValue: '🌑 纯黑' },
              POS: { type: 'string', menu: 'positionMenu', defaultValue: '📍 中上' },
              ANIM: { type: 'string', menu: 'animationMenu', defaultValue: '✨ Q弹进入' }
            }
          },
          { opcode: 'setGroupMaterial', blockType: 'command', text: '🎨 设置组 [GROUP] 材质为 [MATERIAL]', arguments: { GROUP: { type: 'string', defaultValue: '默认' }, MATERIAL: { type: 'string', menu: 'materialMenu', defaultValue: '🌑 纯黑' } } },
          { opcode: 'setGroupPosition', blockType: 'command', text: '📍 设置组 [GROUP] 位置为 [POS]', arguments: { GROUP: { type: 'string', defaultValue: '默认' }, POS: { type: 'string', menu: 'positionMenu', defaultValue: '📍 中上' } } },
          { opcode: 'setGroupOffset', blockType: 'command', text: '↔️ 设置组 [GROUP] 偏移 x:[X] y:[Y]', arguments: { GROUP: { type: 'string', defaultValue: '默认' }, X: { type: 'number', defaultValue: 0 }, Y: { type: 'number', defaultValue: 36 } } },
          { opcode: 'setGroupAnimation', blockType: 'command', text: '🎬 设置组 [GROUP] 动画为 [ANIM]', arguments: { GROUP: { type: 'string', defaultValue: '默认' }, ANIM: { type: 'string', menu: 'animationMenu', defaultValue: '✨ Q弹进入' } } },
          { opcode: 'dynamicIsland', blockType: 'command', text: '📢 灵动岛通知 [MESSAGE] 持续 [DURATION] 秒 组 [GROUP]', arguments: { MESSAGE: { type: 'string', defaultValue: '你好, 灵动岛' }, DURATION: { type: 'number', defaultValue: 2 }, GROUP: { type: 'string', defaultValue: '默认' } } },
          { opcode: 'dynamicIslandIcon', blockType: 'command', text: '😊 灵动岛 图标 [ICON] 文本 [TEXT] 持续 [DURATION] 秒 组 [GROUP]', arguments: { ICON: { type: 'string', defaultValue: '🎉' }, TEXT: { type: 'string', defaultValue: '新消息' }, DURATION: { type: 'number', defaultValue: 2 }, GROUP: { type: 'string', defaultValue: '默认' } } },
          // 原简易进度条（内部映射为 __default）
          { opcode: 'dynamicIslandProgress', blockType: 'command', text: '📊 灵动岛进度 [TEXT] 进度 [VALUE] 持续 [DURATION] 秒 组 [GROUP]', arguments: { TEXT: { type: 'string', defaultValue: '下载中' }, VALUE: { type: 'number', defaultValue: 50 }, DURATION: { type: 'number', defaultValue: 3 }, GROUP: { type: 'string', defaultValue: '默认' } } },
          // 新增命名进度条
          {
            opcode: 'namedProgressBar',
            blockType: 'command',
            text: '📊 进度条 [NAME] 文本 [TEXT] 进度 [VALUE] 空闲 [DURATION] 秒 样式 [STYLE] 组 [GROUP]',
            arguments: {
              NAME: { type: 'string', defaultValue: '下载1' },
              TEXT: { type: 'string', defaultValue: '下载中' },
              VALUE: { type: 'number', defaultValue: 50 },
              DURATION: { type: 'number', defaultValue: 3 },
              STYLE: { type: 'string', menu: 'progressStyleMenu', defaultValue: '经典绿' },
              GROUP: { type: 'string', defaultValue: '默认' }
            }
          },
          {
            opcode: 'updateProgressByName',
            blockType: 'command',
            text: '🔄 更新进度条 [NAME] 进度为 [VALUE]',
            arguments: { NAME: { type: 'string', defaultValue: '下载1' }, VALUE: { type: 'number', defaultValue: 80 } }
          },
          {
            opcode: 'removeProgressByName',
            blockType: 'command',
            text: '❌ 移除进度条 [NAME]',
            arguments: { NAME: { type: 'string', defaultValue: '下载1' } }
          },
          {
            opcode: 'getProgressByName',
            blockType: 'reporter',
            text: '📈 获取进度条 [NAME] 的进度',
            arguments: { NAME: { type: 'string', defaultValue: '下载1' } }
          },
          { opcode: 'informationIsland', blockType: 'command', text: '💬 信息灵动岛 标题 [TITLE] 内容 [CONTENT] 持续 [DURATION] 秒 组 [GROUP]', arguments: { TITLE: { type: 'string', defaultValue: '提示' }, CONTENT: { type: 'string', defaultValue: '详情...' }, DURATION: { type: 'number', defaultValue: 5 }, GROUP: { type: 'string', defaultValue: '默认' } } },
          { opcode: 'hideAllIslands', blockType: 'command', text: '🧹 隐藏所有灵动岛通知' }
        ],
        menus: {
          materialMenu: { acceptReporters: true, items: ['🌑 纯黑', '💧 液态玻璃', '🧊 亚克力', '🌫️ 毛玻璃', '⬜ 纯白', '🔴 纯红', '🖤 磨砂黑', '💎 半透蓝', '🌟 渐变金', '🌃 深色玻璃', '🌈 极光玻璃', '☁️ 浅灰', '🦋 浅蓝', '🍃 浅绿'] },
          positionMenu: { acceptReporters: true, items: ['📍 中上', '↖️ 左上', '↗️ 右上', '⬅️ 左中', '➡️ 右中', '↙️ 左下', '↘️ 右下', '✏️ 自定义'] },
          animationMenu: { acceptReporters: true, items: ['✨ Q弹进入', '⬅️ 左侧滑入', '➡️ 右侧滑入', '⬇️ 上方坠入', '🔄 翻转进入', '🔍 缩放进入'] },
          progressStyleMenu: { acceptReporters: true, items: ['经典绿', '海蓝', '活力橙', '优雅紫', '彩虹渐变', '粗条深色'] }
        }
      };
    }

    _getGroup(name, runtime) {
      if (!name) name = '默认';
      if (!this.groups[name]) this.groups[name] = new GroupConfig(name, runtime || this.runtime);
      return this.groups[name];
    }

    _ensureRuntime(util) {
      if (!this.runtime && util && util.runtime) this.runtime = util.runtime;
    }

    // ---------- 积木方法 ----------
    setGroupProps(args, util) { this._ensureRuntime(util); const g = this._getGroup(args.GROUP, this.runtime); g.material = args.MATERIAL; g.animation = args.ANIM; g.updatePosition(args.POS); }
    setGroupMaterial(args, util) { this._ensureRuntime(util); this._getGroup(args.GROUP, this.runtime).material = args.MATERIAL; }
    setGroupPosition(args, util) { this._ensureRuntime(util); this._getGroup(args.GROUP, this.runtime).updatePosition(args.POS); }
    setGroupOffset(args, util) { this._ensureRuntime(util); this._getGroup(args.GROUP, this.runtime).setOffset(Number(args.X)||0, Number(args.Y)||36); }
    setGroupAnimation(args, util) { this._ensureRuntime(util); this._getGroup(args.GROUP, this.runtime).animation = args.ANIM; }

    dynamicIsland(args, util) { this._ensureRuntime(util); this._showBasicIsland('text', String(args.MESSAGE), Number(args.DURATION)||2, String(args.GROUP)||'默认', this.runtime); }
    dynamicIslandIcon(args, util) { this._ensureRuntime(util); this._showBasicIsland('icon', { ICON: String(args.ICON), TEXT: String(args.TEXT) }, Number(args.DURATION)||2, String(args.GROUP)||'默认', this.runtime); }

    dynamicIslandProgress(args, util) {
      this._ensureRuntime(util);
      this._showNamedProgress('__default', String(args.TEXT), Number(args.VALUE)||0, Number(args.DURATION)||3, String(args.GROUP)||'默认', '经典绿', this.runtime);
    }

    namedProgressBar(args, util) {
      this._ensureRuntime(util);
      this._showNamedProgress(String(args.NAME), String(args.TEXT), Number(args.VALUE)||0, Number(args.DURATION)||3, String(args.GROUP)||'默认', String(args.STYLE), this.runtime);
    }

    updateProgressByName(args, util) {
      this._ensureRuntime(util);
      const name = String(args.NAME);
      const value = Math.min(100, Math.max(0, Number(args.VALUE)||0));
      const item = this._progressItems[name];
      if (item && item.el.isConnected) {
        item.el.querySelector('.island-progress-fill').style.width = value + '%';
        item.progressValue = value;
        // 重置空闲定时器
        if (item.idleDuration > 0) {
          clearTimeout(item.timerId);
          item.timerId = setTimeout(() => {
            item.removeFn();
            delete this._progressItems[name];
          }, item.idleDuration * 1000);
        }
      }
    }

    removeProgressByName(args, util) {
      this._ensureRuntime(util);
      const name = String(args.NAME);
      const item = this._progressItems[name];
      if (item) {
        clearTimeout(item.timerId);
        if (item.removeFn) item.removeFn();
        delete this._progressItems[name];
      }
    }

    getProgressByName(args, util) {
      this._ensureRuntime(util);
      const name = String(args.NAME);
      const item = this._progressItems[name];
      if (item && item.el.isConnected) return item.progressValue;
      return 0;
    }

    informationIsland(args, util) { this._ensureRuntime(util); this._showInfoIsland(String(args.TITLE), String(args.CONTENT), Number(args.DURATION)||5, String(args.GROUP)||'默认', this.runtime); }

    hideAllIslands() {
      Object.values(this._progressItems).forEach(item => {
        clearTimeout(item.timerId);
        if (item.removeFn) item.removeFn();
      });
      this._progressItems = {};
      Object.values(this.groups).forEach(g => g.stack.clear());
    }

    // ---- 内部方法 ----
    _showBasicIsland(type, msgOrArgs, dur, groupName, runtime) {
      const group = this._getGroup(groupName, runtime);
      this._prepareRoot();
      const el = document.createElement('div');
      el.className = `st-dynamic-island ${MATERIAL_MAP[group.material] || 'st-black'}`;
      if (type === 'icon') {
        el.classList.add('st-island-icon');
        el.innerHTML = `<span class="island-icon-left">${msgOrArgs.ICON}</span><span class="island-icon-text">${msgOrArgs.TEXT}</span>`;
      } else {
        el.textContent = msgOrArgs;
      }
      el.style.pointerEvents = 'auto';
      this.root.appendChild(el);
      const stack = group.stack;
      stack.add(el, dur);
      stack._layout();
      this._triggerEnter(el, group.animation, stack);
    }

    _showNamedProgress(name, text, value, dur, groupName, style, runtime) {
      const group = this._getGroup(groupName, runtime);
      this._prepareRoot();

      // 同名进度条先移除
      if (this._progressItems[name]) {
        const old = this._progressItems[name];
        clearTimeout(old.timerId);
        if (old.removeFn) old.removeFn();
        delete this._progressItems[name];
      }

      const el = document.createElement('div');
      el.className = `st-dynamic-island st-island-progress ${MATERIAL_MAP[group.material]}`;
      el.innerHTML = `<span class="island-text">${text}</span><div class="island-progress-track"><div class="island-progress-fill" style="width:${value}%"></div></div>`;
      const fillEl = el.querySelector('.island-progress-fill');
      const styleClass = PROGRESS_STYLES[style] || 'st-progress-green';
      fillEl.classList.add(styleClass);
      el.style.pointerEvents = 'auto';
      this.root.appendChild(el);

      const stack = group.stack;
      const removeFn = stack.add(el, 0, false); // 手动移除
      stack._layout();
      this._triggerEnter(el, group.animation, stack);

      // 空闲定时器逻辑：如果 dur > 0，设置定时器；否则永不自动消失
      let timerId = null;
      if (dur > 0) {
        timerId = setTimeout(() => {
          if (this._progressItems[name] && this._progressItems[name].el === el) {
            removeFn();
            delete this._progressItems[name];
          }
        }, dur * 1000);
      }

      this._progressItems[name] = {
        el, removeFn, timerId, progressValue: value, idleDuration: dur
      };
    }

    _showInfoIsland(title, content, dur, groupName, runtime) {
      const group = this._getGroup(groupName, runtime);
      this._prepareRoot();
      const capsule = document.createElement('div');
      capsule.className = `st-dynamic-island st-info-capsule ${MATERIAL_MAP[group.material]}`;
      capsule.innerHTML = `<span class="island-icon-left">💬</span><span class="island-icon-text">${title}</span>`;
      capsule.style.pointerEvents = 'auto';
      this.root.appendChild(capsule);
      const stack = group.stack;
      const removeFromStack = stack.add(capsule, dur, false);
      stack._layout();
      this._triggerEnter(capsule, group.animation, stack);
      const state = { title, content, dur, stack, removeFromStack };
      setTimeout(() => { this._bindInfoExpand(capsule, state); }, 100);
    }

    _bindInfoExpand(capsule, state) {
      const self = this;
      let timeoutId = setTimeout(() => { if (!capsule._expanded) state.removeFromStack(); }, state.dur * 1000);
      capsule._timeoutId = timeoutId;
      capsule.addEventListener('mouseenter', () => { if (!capsule._expanded) capsule.style.filter = 'brightness(1.1)'; });
      capsule.addEventListener('mouseleave', () => capsule.style.filter = '');
      const expandHandler = () => {
        if (capsule._expanded) return;
        capsule._expanded = true;
        clearTimeout(capsule._timeoutId);
        capsule.style.filter = '';
        capsule.innerHTML = `
          <div class="st-info-panel">
            <div class="st-info-header"><span class="st-info-title">${state.title}</span><button class="st-info-close">✕</button></div>
            <div class="st-info-content">${state.content}</div>
          </div>`;
        capsule.classList.add('st-info-expanded');
        state.stack._layout();
        const closeBtn = capsule.querySelector('.st-info-close');
        closeBtn.addEventListener('click', e => { e.stopPropagation(); self._animateInfoExit(capsule, state.stack); });
        const outsideHandler = function(e) {
          if (capsule.contains(e.target)) return;
          document.removeEventListener('click', outsideHandler, true);
          self._collapseInfoCapsule(capsule, state);
        };
        document.addEventListener('click', outsideHandler, true);
        capsule._outsideHandler = outsideHandler;
        capsule._timeoutId = setTimeout(() => { if (capsule._expanded) self._animateInfoExit(capsule, state.stack); }, state.dur * 1000);
      };
      capsule.addEventListener('click', expandHandler);
      capsule._expandHandler = expandHandler;
    }

    _collapseInfoCapsule(capsule, state) {
      if (capsule._exiting) return;
      if (capsule._outsideHandler) { document.removeEventListener('click', capsule._outsideHandler, true); capsule._outsideHandler = null; }
      clearTimeout(capsule._timeoutId);
      capsule.innerHTML = `<span class="island-icon-left">💬</span><span class="island-icon-text">${state.title}</span>`;
      capsule.classList.remove('st-info-expanded');
      capsule._expanded = false;
      state.stack._layout();
      if (capsule._expandHandler) { capsule.removeEventListener('click', capsule._expandHandler); }
      this._bindInfoExpand(capsule, state);
    }

    _animateInfoExit(el, stack) {
      if (el._exiting) return;
      el._exiting = true;
      if (el._outsideHandler) { document.removeEventListener('click', el._outsideHandler, true); el._outsideHandler = null; }
      clearTimeout(el._timeoutId);
      const item = stack.items.find(i => i.el === el);
      if (item) { item.exiting = true; clearTimeout(item.timer); }
      el.classList.add('st-info-exit');
      const onTransitionEnd = (e) => {
        if (e.propertyName === 'opacity') {
          el.removeEventListener('transitionend', onTransitionEnd);
          if (el.parentNode) el.remove();
          const idx = stack.items.findIndex(i => i.el === el);
          if (idx !== -1) { stack.items.splice(idx, 1); requestAnimationFrame(() => stack._layout()); }
        }
      };
      el.addEventListener('transitionend', onTransitionEnd);
      setTimeout(() => {
        if (el.parentNode) el.remove();
        const idx = stack.items.findIndex(i => i.el === el);
        if (idx !== -1) { stack.items.splice(idx, 1); requestAnimationFrame(() => stack._layout()); }
      }, 600);
    }

    _triggerEnter(el, animationName, stack) {
      const targetTransform = this._getTargetTransform(stack);
      const animConfig = ANIMATIONS[animationName] || { type: 'bounce' };
      let initialTransform = targetTransform;
      switch (animConfig.type) {
        case 'slide':
          if (animConfig.direction === 'left') {
            initialTransform = targetTransform.replace(/translate\([^)]+\)/, match => {
              if (match.includes('-50%')) return 'translate(calc(-50% - 200px), var(--y))';
              if (match.includes('0')) return 'translate(-150%, var(--y))';
              return 'translate(-200px, var(--y))';
            });
          } else {
            initialTransform = targetTransform.replace(/translate\([^)]+\)/, match => {
              if (match.includes('-50%')) return 'translate(calc(-50% + 200px), var(--y))';
              if (match.includes('0')) return 'translate(150%, var(--y))';
              return 'translate(200px, var(--y))';
            });
          }
          break;
        case 'drop': initialTransform = targetTransform.replace('var(--y)', '-300px') + ' scale(0.5)'; break;
        case 'flip': initialTransform = targetTransform + ' rotateY(90deg)'; break;
        case 'zoom': initialTransform = targetTransform + ' scale(0.3)'; break;
        default: initialTransform = targetTransform + ' scale(0.7)'; break;
      }
      el.style.transition = 'none';
      el.style.transform = initialTransform;
      el.style.opacity = '0';
      el.getBoundingClientRect();
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.2,1.8,0.4,1)';
        el.style.transform = targetTransform;
        el.style.opacity = '1';
        setTimeout(() => { el.style.transition = ''; stack._layout(); }, 600);
      });
    }

    _getTargetTransform(stack) {
      if (stack.alignX === 'left') return 'translate(0, var(--y))';
      if (stack.alignX === 'right') return 'translate(0, var(--y))';
      return 'translate(-50%, var(--y))';
    }

    _getCanvas() {
      let canvas = document.querySelector('.stage-wrapper canvas');
      if (canvas && canvas.isConnected) return canvas;
      const canvases = document.querySelectorAll('canvas');
      let maxArea = 0, best = null;
      canvases.forEach(c => { const a = c.width * c.height; if (a > maxArea) { maxArea = a; best = c; } });
      return best;
    }

    _prepareRoot() {
      if (!document.getElementById('st-island-styles-pro')) {
        const style = document.createElement('style');
        style.id = 'st-island-styles-pro';
        style.textContent = this._getCSS();
        document.head.appendChild(style);
      }
      if (!this.root || !this.root.isConnected) {
        this.root = document.createElement('div');
        this.root.id = 'st-island-root-pro';
        this.root.style.position = 'fixed';
        this.root.style.zIndex = '9998';
        this.root.style.pointerEvents = 'none';
        this.root.style.overflow = 'visible';
        document.body.appendChild(this.root);
      }
      const canvas = this._getCanvas();
      const rect = canvas ? canvas.getBoundingClientRect() : { left:0, top:0, width:window.innerWidth, height:window.innerHeight };
      Object.assign(this.root.style, { left: rect.left+'px', top: rect.top+'px', width: rect.width+'px', height: rect.height+'px' });
    }

    _getCSS() {
      return `
        .st-black { background: rgba(0,0,0,0.85); color:#fff; border:1px solid rgba(255,255,255,0.2); }
        .st-white { background: rgba(255,255,255,0.92); color:#000; border:1px solid rgba(0,0,0,0.08); }
        .st-red { background: rgba(220,30,30,0.85); color:#fff; border:1px solid rgba(255,255,255,0.3); }
        .st-matte-black { background: rgba(20,20,20,0.9); color:#eee; border:1px solid rgba(255,255,255,0.1); }
        .st-semi-blue { background: rgba(30,144,255,0.3); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border:1px solid rgba(255,255,255,0.4); color:#fff; text-shadow:0 1px 2px rgba(0,0,0,0.5); }
        .st-gradient-gold { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); color:#3e2723; border:1px solid rgba(255,255,255,0.4); }
        .st-dark-glass { background: rgba(0,0,0,0.35); backdrop-filter: blur(30px) saturate(150%); -webkit-backdrop-filter: blur(30px) saturate(150%); border:1px solid rgba(255,255,255,0.2); color:#fff; }
        .st-light-gray { background: rgba(200,200,200,0.8); color:#000; border:1px solid rgba(255,255,255,0.5); }
        .st-light-blue { background: rgba(173,216,230,0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); color:#000; border:1px solid rgba(255,255,255,0.6); }
        .st-light-green { background: rgba(144,238,144,0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); color:#000; border:1px solid rgba(255,255,255,0.6); }
        .st-liquid-glass {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(35px) saturate(180%) contrast(105%) brightness(1.05);
          -webkit-backdrop-filter: blur(35px) saturate(180%) contrast(105%) brightness(1.05);
          border:1px solid rgba(255,255,255,0.5); color:#000; text-shadow:0 1px 2px rgba(255,255,255,0.8);
          box-shadow:0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.1);
        }
        .st-acrylic {
          background: rgba(240,240,240,0.25);
          backdrop-filter: blur(25px) saturate(120%) contrast(90%);
          -webkit-backdrop-filter: blur(25px) saturate(120%) contrast(90%);
          border:1px solid rgba(255,255,255,0.3); color:#222; text-shadow:0 1px 2px rgba(255,255,255,0.7);
        }
        .st-frosted {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border:1px solid rgba(255,255,255,0.25); color:#fff; text-shadow:0 1px 4px rgba(0,0,0,0.6);
        }
        .st-aurora-glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(173,216,230,0.3) 50%, rgba(144,238,144,0.2) 100%);
          backdrop-filter: blur(30px) saturate(200%) hue-rotate(20deg);
          -webkit-backdrop-filter: blur(30px) saturate(200%) hue-rotate(20deg);
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.1);
          color: #111;
          text-shadow: 0 1px 4px rgba(255,255,255,0.9);
        }

        .st-dynamic-island {
          position: absolute;
          padding:10px 24px; border-radius:36px; font-size:15px; max-width:85%;
          display:flex; flex-direction:column; gap:6px; white-space:nowrap; overflow:hidden;
          pointer-events:auto;
        }
        .st-exit-up {
          transform: translate(-50%, -200px) scale(0.8) !important; opacity:0 !important;
          transition: transform 0.4s cubic-bezier(0.4,0,1,1), opacity 0.3s ease;
        }
        .st-island-icon { flex-direction:row; align-items:center; gap:12px; padding:10px 24px; }
        .island-icon-left { font-size:24px; line-height:1; flex-shrink:0; }
        .island-icon-text { font-size:15px; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .st-island-progress { padding:10px 20px; gap:4px; }
        .island-text { font-size:14px; }
        .island-progress-track { width:100%; height:4px; background:rgba(255,255,255,0.3); border-radius:2px; overflow:hidden; }
        .island-progress-fill { height:100%; border-radius:2px; transition:width 0.3s; }
        .st-progress-green { background:#4caf50; }
        .st-progress-blue { background:#2196F3; }
        .st-progress-orange { background:#FF9800; }
        .st-progress-purple { background:#9C27B0; }
        .st-progress-rainbow { background: linear-gradient(90deg, #f44336, #FF9800, #FFEB3B, #4caf50, #2196F3, #9C27B0); }
        .st-progress-thick { height:8px; background:#333; border-radius:4px; }

        .st-info-capsule {
          cursor: pointer;
          min-width: 160px;
          transition: width 0.4s cubic-bezier(0.2,1.8,0.4,1), height 0.4s cubic-bezier(0.2,1.8,0.4,1), border-radius 0.4s cubic-bezier(0.2,1.8,0.4,1), padding 0.4s cubic-bezier(0.2,1.8,0.4,1), filter 0.2s;
        }
        .st-info-expanded {
          width:300px !important; max-width:85vw !important; padding:16px !important;
          border-radius:24px !important; white-space:normal !important; cursor:default; height:auto !important;
        }
        .st-info-panel { display:flex; flex-direction:column; gap:10px; }
        .st-info-header { display:flex; justify-content:space-between; align-items:center; }
        .st-info-title { font-size:16px; font-weight:600; }
        .st-info-close {
          background:rgba(255,255,255,0.2); border:none; border-radius:50%; width:24px; height:24px;
          display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; color:inherit;
        }
        .st-info-content { font-size:14px; line-height:1.4; white-space:pre-wrap; word-break:break-word; }
        .st-info-exit {
          transform: translate(-50%, -200px) scale(0.6) !important; opacity:0 !important;
          transition: transform 0.5s cubic-bezier(0.2,1.8,0.4,1), opacity 0.3s ease !important;
          pointer-events:none !important;
        }
      `;
    }
  }

  Scratch.extensions.register(new StDynamicIslandPro());
})(Scratch);