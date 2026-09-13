// ST灵动视窗2.0 - 完整版（输入限制选项化 + 样式设置）
(function (Scratch) {
  'use strict';

  class DynamicWindow2 {
    constructor() {
      this.activeOverlay = null;
      this.lastChoice = '';
      this.lastInput = '';
      this.forceTimer = null;
      this.forceSecondsLeft = 0;

      this.windowBackgroundColor = '#FFFFFF';
      this.windowTextColor = '#333333';
      this.windowMaterial = '纯色';
    }

    getInfo() {
      return {
        id: 'stDynamicWindow2',
        name: 'ST灵动视窗2.0',
        color1: '#5B4CAF',
        color2: '#3B2C8F',
        blocks: [
          {
            opcode: 'showTextModal',
            blockType: 'command',
            text: '显示纯文本弹窗 标题 [TITLE] 内容 [CONTENT]',
            arguments: {
              TITLE: { type: 'string', defaultValue: '提示' },
              CONTENT: { type: 'string', defaultValue: '这是一条消息' }
            }
          },
          {
            opcode: 'showChoiceModal',
            blockType: 'command',
            text: '显示选择弹窗 标题 [TITLE] 内容 [CONTENT] 选项1 [OPT1] 选项2 [OPT2] 选项3 [OPT3]',
            arguments: {
              TITLE: { type: 'string', defaultValue: '请选择' },
              CONTENT: { type: 'string', defaultValue: '请选择一个选项' },
              OPT1: { type: 'string', defaultValue: '确定' },
              OPT2: { type: 'string', defaultValue: '取消' },
              OPT3: { type: 'string', defaultValue: '' }
            }
          },
          {
            opcode: 'showNoticeModal',
            blockType: 'command',
            text: '显示强制观看弹窗 标题 [TITLE] 内容 [CONTENT] 强制观看 [SECONDS] 秒',
            arguments: {
              TITLE: { type: 'string', defaultValue: '重要提醒' },
              CONTENT: { type: 'string', defaultValue: '请仔细阅读此内容' },
              SECONDS: { type: 'number', defaultValue: 5 }
            }
          },
          {
            opcode: 'showInputModal',
            blockType: 'command',
            text: '显示输入弹窗 标题 [TITLE] 内容 [CONTENT] 最少 [MIN] 最多 [MAX] 中文 [CH] 英文 [EN] 数字 [NUM]',
            arguments: {
              TITLE: { type: 'string', defaultValue: '输入' },
              CONTENT: { type: 'string', defaultValue: '请输入内容' },
              MIN: { type: 'number', defaultValue: 1 },
              MAX: { type: 'number', defaultValue: 20 },
              CH: { type: 'string', menu: 'allowMenu', defaultValue: '允许' },
              EN: { type: 'string', menu: 'allowMenu', defaultValue: '允许' },
              NUM: { type: 'string', menu: 'allowMenu', defaultValue: '允许' }
            }
          },
          {
            opcode: 'showWebModal',
            blockType: 'command',
            text: '显示网页弹窗 标题 [TITLE] 网址 [URL]',
            arguments: {
              TITLE: { type: 'string', defaultValue: '网页' },
              URL: { type: 'string', defaultValue: 'https://example.com' }
            }
          },
          {
            opcode: 'setBackgroundColor',
            blockType: 'command',
            text: '设置弹窗背景颜色 [COLOR]',
            arguments: {
              COLOR: { type: 'string', menu: 'backgroundColorMenu', defaultValue: '#FFFFFF' }
            }
          },
          {
            opcode: 'setTextColor',
            blockType: 'command',
            text: '设置弹窗字体颜色 [COLOR]',
            arguments: {
              COLOR: { type: 'string', menu: 'textColorMenu', defaultValue: '#333333' }
            }
          },
          {
            opcode: 'setMaterial',
            blockType: 'command',
            text: '设置弹窗材质 [MATERIAL]',
            arguments: {
              MATERIAL: { type: 'string', menu: 'materialMenu', defaultValue: '纯色' }
            }
          },
          {
            opcode: 'setWindowVisible',
            blockType: 'command',
            text: '设置弹窗显示 [VISIBLE]',
            arguments: {
              VISIBLE: { type: 'string', menu: 'visibleMenu', defaultValue: '显示' }
            }
          },
          {
            opcode: 'getLastInput',
            blockType: 'reporter',
            text: '获取上一次输入文本'
          },
          {
            opcode: 'getLastChoice',
            blockType: 'reporter',
            text: '获取上一次选择选项'
          },
          {
            opcode: 'closeModal',
            blockType: 'command',
            text: '关闭当前弹窗'
          }
        ],
        menus: {
          allowMenu: ['允许', '禁止'],
          backgroundColorMenu: [
            { text: '白色', value: '#FFFFFF' },
            { text: '黑色', value: '#000000' },
            { text: '深灰', value: '#333333' },
            { text: '蓝色', value: '#2196F3' },
            { text: '绿色', value: '#4CAF50' },
            { text: '橙色', value: '#FF9800' },
            { text: '半透明白', value: 'rgba(255,255,255,0.9)' },
            { text: '半透明黑', value: 'rgba(0,0,0,0.8)' }
          ],
          textColorMenu: [
            { text: '白色', value: '#FFFFFF' },
            { text: '黑色', value: '#000000' },
            { text: '灰色', value: '#666666' },
            { text: '蓝色', value: '#2196F3' },
            { text: '绿色', value: '#4CAF50' },
            { text: '橙色', value: '#FF9800' }
          ],
          materialMenu: ['纯色', '毛玻璃', '液态玻璃', '亚克力'],
          visibleMenu: ['显示', '隐藏']
        }
      };
    }

    _applyDialogStyle(dialog) {
      dialog.style.color = this.windowTextColor;
      dialog.classList.remove('st-modal-glass', 'st-modal-liquid', 'st-modal-acrylic');
      switch (this.windowMaterial) {
        case '毛玻璃':
          dialog.classList.add('st-modal-glass');
          dialog.style.backgroundColor = this.windowBackgroundColor;
          dialog.style.backdropFilter = 'blur(15px)';
          dialog.style.webkitBackdropFilter = 'blur(15px)';
          break;
        case '液态玻璃':
          dialog.classList.add('st-modal-liquid');
          dialog.style.backgroundColor = 'rgba(255,255,255,0.15)';
          dialog.style.backdropFilter = 'blur(35px) saturate(180%)';
          dialog.style.webkitBackdropFilter = 'blur(35px) saturate(180%)';
          break;
        case '亚克力':
          dialog.classList.add('st-modal-acrylic');
          dialog.style.backgroundColor = 'rgba(240,240,240,0.25)';
          dialog.style.backdropFilter = 'blur(25px) saturate(120%) contrast(90%)';
          dialog.style.webkitBackdropFilter = 'blur(25px) saturate(120%) contrast(90%)';
          break;
        default:
          dialog.style.backdropFilter = '';
          dialog.style.webkitBackdropFilter = '';
          dialog.style.backgroundColor = this.windowBackgroundColor;
      }
    }

    _createOverlay() {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '10000';
      overlay.style.cursor = 'pointer';
      overlay.style.pointerEvents = 'auto';
      overlay.style.transition = 'opacity 0.25s ease';
      overlay.style.opacity = '0';
      overlay.setAttribute('data-st-modal', 'true');
      return overlay;
    }

    _createDialog() {
      const dialog = document.createElement('div');
      dialog.style.padding = '20px 24px';
      dialog.style.borderRadius = '16px';
      dialog.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      dialog.style.minWidth = '280px';
      dialog.style.maxWidth = '80vw';
      dialog.style.fontFamily = 'sans-serif';
      dialog.style.transform = 'scale(0.7)';
      dialog.style.transition = 'transform 0.45s cubic-bezier(0.2, 1.8, 0.4, 1), opacity 0.3s ease';
      dialog.style.opacity = '0';
      this._applyDialogStyle(dialog);
      return dialog;
    }

    _animateIn(overlay, dialog) {
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        dialog.style.opacity = '1';
        dialog.style.transform = 'scale(1)';
      });
    }

    _animateClose(overlay) {
      overlay.style.opacity = '0';
      const dialog = overlay.querySelector('div');
      if (dialog) {
        dialog.style.opacity = '0';
        dialog.style.transform = 'scale(0.7)';
      }
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (this.activeOverlay === overlay) this.activeOverlay = null;
      }, 350);
    }

    _closeCurrent() {
      if (this.forceTimer) {
        clearInterval(this.forceTimer);
        this.forceTimer = null;
      }
      if (this.activeOverlay) {
        this._animateClose(this.activeOverlay);
        this.activeOverlay = null;
      }
    }

    showTextModal(args) {
      this._closeCurrent();
      const title = String(args.TITLE);
      const content = String(args.CONTENT);

      const overlay = this._createOverlay();
      const dialog = this._createDialog();

      const titleEl = document.createElement('div');
      titleEl.textContent = title;
      titleEl.style.fontSize = '18px';
      titleEl.style.fontWeight = 'bold';
      titleEl.style.marginBottom = '8px';
      dialog.appendChild(titleEl);

      const contentEl = document.createElement('div');
      contentEl.textContent = content;
      contentEl.style.fontSize = '15px';
      contentEl.style.lineHeight = '1.5';
      contentEl.style.whiteSpace = 'pre-wrap';
      contentEl.style.wordBreak = 'break-word';
      dialog.appendChild(contentEl);

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      this._animateIn(overlay, dialog);

      overlay.addEventListener('click', () => {
        this._animateClose(overlay);
      });

      this.activeOverlay = overlay;
    }

    showChoiceModal(args) {
      this._closeCurrent();
      const title = String(args.TITLE);
      const content = String(args.CONTENT);
      const opt1 = String(args.OPT1).trim();
      const opt2 = String(args.OPT2).trim();
      const opt3 = String(args.OPT3).trim();
      const options = [opt1, opt2, opt3].filter(opt => opt !== '');

      if (options.length < 2) {
        console.warn('选择弹窗至少需要2个选项');
        return;
      }

      const overlay = this._createOverlay();
      const dialog = this._createDialog();

      const titleEl = document.createElement('div');
      titleEl.textContent = title;
      titleEl.style.fontSize = '18px';
      titleEl.style.fontWeight = 'bold';
      titleEl.style.marginBottom = '8px';
      dialog.appendChild(titleEl);

      const contentEl = document.createElement('div');
      contentEl.textContent = content;
      contentEl.style.fontSize = '15px';
      contentEl.style.lineHeight = '1.5';
      contentEl.style.marginBottom = '16px';
      contentEl.style.whiteSpace = 'pre-wrap';
      contentEl.style.wordBreak = 'break-word';
      dialog.appendChild(contentEl);

      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '10px';
      btnContainer.style.justifyContent = 'center';
      btnContainer.style.flexWrap = 'wrap';

      options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.style.padding = '8px 20px';
        btn.style.borderRadius = '20px';
        btn.style.border = '1px solid #ccc';
        btn.style.backgroundColor = '#f5f5f5';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.transition = 'background 0.2s, transform 0.1s';
        btn.addEventListener('mouseenter', () => { btn.style.backgroundColor = '#e0e0e0'; });
        btn.addEventListener('mouseleave', () => { btn.style.backgroundColor = '#f5f5f5'; });
        btn.addEventListener('mousedown', () => { btn.style.transform = 'scale(0.95)'; });
        btn.addEventListener('mouseup', () => { btn.style.transform = 'scale(1)'; });

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.lastChoice = option;
          this._animateClose(overlay);
        });

        btnContainer.appendChild(btn);
      });

      dialog.appendChild(btnContainer);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      this._animateIn(overlay, dialog);

      overlay.addEventListener('click', () => {
        this._animateClose(overlay);
      });

      this.activeOverlay = overlay;
    }

    showNoticeModal(args) {
      this._closeCurrent();
      const title = String(args.TITLE);
      const content = String(args.CONTENT);
      const forceSeconds = Math.max(1, Number(args.SECONDS) || 5);

      const overlay = this._createOverlay();
      const dialog = this._createDialog();

      const titleEl = document.createElement('div');
      titleEl.textContent = title;
      titleEl.style.fontSize = '18px';
      titleEl.style.fontWeight = 'bold';
      titleEl.style.marginBottom = '8px';
      dialog.appendChild(titleEl);

      const contentEl = document.createElement('div');
      contentEl.textContent = content;
      contentEl.style.fontSize = '15px';
      contentEl.style.lineHeight = '1.5';
      contentEl.style.marginBottom = '12px';
      contentEl.style.whiteSpace = 'pre-wrap';
      contentEl.style.wordBreak = 'break-word';
      dialog.appendChild(contentEl);

      const countdownEl = document.createElement('div');
      countdownEl.style.fontSize = '14px';
      countdownEl.style.color = '#888';
      countdownEl.style.textAlign = 'center';
      countdownEl.textContent = `请在 ${forceSeconds} 秒后关闭`;
      dialog.appendChild(countdownEl);

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      this._animateIn(overlay, dialog);

      this.forceSecondsLeft = forceSeconds;
      this.forceTimer = setInterval(() => {
        this.forceSecondsLeft--;
        countdownEl.textContent = `请在 ${this.forceSecondsLeft} 秒后关闭`;
        if (this.forceSecondsLeft <= 0) {
          clearInterval(this.forceTimer);
          this.forceTimer = null;
          this._animateClose(overlay);
        }
      }, 1000);

      overlay.addEventListener('click', () => {
        if (this.forceSecondsLeft > 0) {
          countdownEl.style.color = '#e53935';
          countdownEl.textContent = `还需等待 ${this.forceSecondsLeft} 秒`;
        }
      });

      this.activeOverlay = overlay;
    }

    showInputModal(args) {
      this._closeCurrent();
      const title = String(args.TITLE);
      const content = String(args.CONTENT);
      const minLen = Math.max(0, Number(args.MIN) || 1);
      const maxLen = Math.max(minLen, Number(args.MAX) || 20);
      const allowChinese = String(args.CH) === '允许';
      const allowEnglish = String(args.EN) === '允许';
      const allowNumber = String(args.NUM) === '允许';

      const overlay = this._createOverlay();
      const dialog = this._createDialog();

      const titleEl = document.createElement('div');
      titleEl.textContent = title;
      titleEl.style.fontSize = '18px';
      titleEl.style.fontWeight = 'bold';
      titleEl.style.marginBottom = '8px';
      dialog.appendChild(titleEl);

      const contentEl = document.createElement('div');
      contentEl.textContent = content;
      contentEl.style.fontSize = '15px';
      contentEl.style.lineHeight = '1.5';
      contentEl.style.marginBottom = '12px';
      contentEl.style.whiteSpace = 'pre-wrap';
      contentEl.style.wordBreak = 'break-word';
      dialog.appendChild(contentEl);

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '请输入...';
      input.style.width = '100%';
      input.style.padding = '8px';
      input.style.fontSize = '14px';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '6px';
      input.style.boxSizing = 'border-box';
      input.style.marginBottom = '8px';
      dialog.appendChild(input);

      const errorEl = document.createElement('div');
      errorEl.style.fontSize = '12px';
      errorEl.style.color = '#e53935';
      errorEl.style.minHeight = '16px';
      dialog.appendChild(errorEl);

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      this._animateIn(overlay, dialog);

      setTimeout(() => input.focus(), 100);

      const validate = (text) => {
        if (text.length < minLen) return `至少输入 ${minLen} 个字符`;
        if (text.length > maxLen) return `最多输入 ${maxLen} 个字符`;
        if (!allowChinese && /[\u4e00-\u9fa5]/.test(text)) return '不允许输入中文';
        if (!allowEnglish && /[a-zA-Z]/.test(text)) return '不允许输入英文';
        if (!allowNumber && /[0-9]/.test(text)) return '不允许输入数字';
        return '';
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = input.value;
          const err = validate(val);
          if (err) {
            errorEl.textContent = err;
          } else {
            this.lastInput = val;
            this._animateClose(overlay);
          }
        }
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          errorEl.textContent = '请输入内容后按回车关闭';
        }
      });

      this.activeOverlay = overlay;
    }

    showWebModal(args) {
      this._closeCurrent();
      const title = String(args.TITLE);
      const url = String(args.URL);

      const overlay = this._createOverlay();
      overlay.style.cursor = 'default';

      const dialog = this._createDialog();
      dialog.style.width = '80%';
      dialog.style.height = '80%';
      dialog.style.maxWidth = '1200px';
      dialog.style.maxHeight = '800px';
      dialog.style.display = 'flex';
      dialog.style.flexDirection = 'column';
      dialog.style.padding = '0';
      dialog.style.overflow = 'hidden';
      dialog.style.backgroundColor = '#fff';

      const titleBar = document.createElement('div');
      titleBar.style.display = 'flex';
      titleBar.style.alignItems = 'center';
      titleBar.style.justifyContent = 'space-between';
      titleBar.style.padding = '10px 16px';
      titleBar.style.background = '#f5f5f5';
      titleBar.style.borderBottom = '1px solid #ddd';

      const titleEl = document.createElement('span');
      titleEl.textContent = title;
      titleEl.style.fontSize = '16px';
      titleEl.style.fontWeight = 'bold';
      titleEl.style.color = this.windowTextColor;
      titleBar.appendChild(titleEl);

      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '10px';

      const fullscreenBtn = document.createElement('button');
      fullscreenBtn.textContent = '⛶';
      fullscreenBtn.title = '全屏';
      fullscreenBtn.style.border = 'none';
      fullscreenBtn.style.background = 'transparent';
      fullscreenBtn.style.cursor = 'pointer';
      fullscreenBtn.style.fontSize = '18px';
      fullscreenBtn.style.color = this.windowTextColor;
      fullscreenBtn.addEventListener('click', () => {
        this._requestFullscreen(iframe);
      });
      btnContainer.appendChild(fullscreenBtn);

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.title = '关闭';
      closeBtn.style.border = 'none';
      closeBtn.style.background = 'transparent';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.fontSize = '18px';
      closeBtn.style.color = this.windowTextColor;
      closeBtn.addEventListener('click', () => {
        this._animateClose(overlay);
      });
      btnContainer.appendChild(closeBtn);

      titleBar.appendChild(btnContainer);
      dialog.appendChild(titleBar);

      const iframeContainer = document.createElement('div');
      iframeContainer.style.flex = '1';
      iframeContainer.style.width = '100%';
      iframeContainer.style.position = 'relative';

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.display = 'block';
      iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
      iframeContainer.appendChild(iframe);

      dialog.appendChild(iframeContainer);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      this._animateIn(overlay, dialog);

      this.activeOverlay = overlay;
    }

    _requestFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }

    setBackgroundColor(args) {
      this.windowBackgroundColor = String(args.COLOR);
      if (this.activeOverlay) {
        const dialog = this.activeOverlay.querySelector('div');
        if (dialog) this._applyDialogStyle(dialog);
      }
    }

    setTextColor(args) {
      this.windowTextColor = String(args.COLOR);
      if (this.activeOverlay) {
        const dialog = this.activeOverlay.querySelector('div');
        if (dialog) dialog.style.color = this.windowTextColor;
      }
    }

    setMaterial(args) {
      this.windowMaterial = String(args.MATERIAL);
      if (this.activeOverlay) {
        const dialog = this.activeOverlay.querySelector('div');
        if (dialog) this._applyDialogStyle(dialog);
      }
    }

    setWindowVisible(args) {
      const visible = String(args.VISIBLE) === '显示';
      if (this.activeOverlay) {
        this.activeOverlay.style.display = visible ? 'flex' : 'none';
      }
    }

    getLastInput() {
      return this.lastInput;
    }

    getLastChoice() {
      return this.lastChoice;
    }

    closeModal() {
      this._closeCurrent();
    }
  }

  function injectStyles() {
    if (document.getElementById('st-dynamic-window-styles')) return;
    const style = document.createElement('style');
    style.id = 'st-dynamic-window-styles';
    style.textContent = `
      .st-modal-glass { backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); }
      .st-modal-liquid { backdrop-filter: blur(35px) saturate(180%); -webkit-backdrop-filter: blur(35px) saturate(180%); border: 1px solid rgba(255,255,255,0.5); }
      .st-modal-acrylic { backdrop-filter: blur(25px) saturate(120%) contrast(90%); -webkit-backdrop-filter: blur(25px) saturate(120%) contrast(90%); border: 1px solid rgba(255,255,255,0.3); }
    `;
    document.head.appendChild(style);
  }

  injectStyles();
  Scratch.extensions.register(new DynamicWindow2());
})(Scratch);