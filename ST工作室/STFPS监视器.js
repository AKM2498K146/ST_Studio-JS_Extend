// ST实时FPS监视器 - 全屏自动隐藏 + 折线图开关菜单
(function (Scratch) {
  'use strict';

  class FPSMonitor {
    constructor() {
      this.panel = null;
      this.chartCanvas = null;
      this.chartCtx = null;
      this.isVisible = false;          // 用户期望显示状态
      this.animFrameId = null;
      this.lastTime = 0;
      this.frames = 0;
      this.fps = 0;

      this.fpsHistory = [];
      this.maxFps = 0;
      this.minFps = Infinity;
      this.avgFps = 0;
      this.sumFps = 0;
      this.countFps = 0;

      this.position = 'top-left';
      this.customX = 100;
      this.customY = 100;
      this.textColor = '#00FF00';
      this.bgColor = 'rgba(0,0,0,0.7)';
      this.fontSize = 14;
      this.borderRadius = 6;
      this.lowFpsThreshold = 30;
      this.chartLineColor = '#00E5FF';
      this.chartBgColor = 'rgba(0,0,0,0.5)';
      this.chartWidth = 180;
      this.chartHeight = 60;
      this.chartMaxPoints = 60;
      this.showChart = true;

      // 绑定全屏事件
      this._fullscreenHandler = this._handleFullscreenChange.bind(this);
      document.addEventListener('fullscreenchange', this._fullscreenHandler);
      document.addEventListener('webkitfullscreenchange', this._fullscreenHandler);
    }

    getInfo() {
      return {
        id: 'stFPSMonitor',
        name: 'ST实时FPS',
        color1: '#00C853',
        color2: '#00695C',
        blocks: [
          { opcode: 'showMonitor', blockType: 'command', text: '显示FPS监视器' },
          { opcode: 'hideMonitor', blockType: 'command', text: '隐藏FPS监视器' },
          {
            opcode: 'setPosition',
            blockType: 'command',
            text: '设置FPS监视器位置为 [POS]',
            arguments: { POS: { type: 'string', menu: 'positionMenu', defaultValue: 'top-left' } }
          },
          {
            opcode: 'setCustomPosition',
            blockType: 'command',
            text: '设置FPS监视器自定义位置 x:[X] y:[Y]',
            arguments: { X: { type: 'number', defaultValue: 100 }, Y: { type: 'number', defaultValue: 100 } }
          },
          {
            opcode: 'setTextColor',
            blockType: 'command',
            text: '设置FPS文字颜色 [COLOR]',
            arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: '#00FF00' } }
          },
          {
            opcode: 'setBgColor',
            blockType: 'command',
            text: '设置FPS背景颜色 [COLOR]',
            arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: 'rgba(0,0,0,0.7)' } }
          },
          {
            opcode: 'setFontSize',
            blockType: 'command',
            text: '设置FPS字体大小 [SIZE]',
            arguments: { SIZE: { type: 'number', defaultValue: 14 } }
          },
          {
            opcode: 'setChartLineColor',
            blockType: 'command',
            text: '设置折线图线条颜色 [COLOR]',
            arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: '#00E5FF' } }
          },
          {
            opcode: 'setChartBgColor',
            blockType: 'command',
            text: '设置折线图背景颜色 [COLOR]',
            arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: 'rgba(0,0,0,0.5)' } }
          },
          {
            opcode: 'setChartSize',
            blockType: 'command',
            text: '设置折线图大小 宽:[W] 高:[H]',
            arguments: { W: { type: 'number', defaultValue: 180 }, H: { type: 'number', defaultValue: 60 } }
          },
          {
            opcode: 'setChartMaxPoints',
            blockType: 'command',
            text: '设置折线图保留点数 [POINTS]',
            arguments: { POINTS: { type: 'number', defaultValue: 60 } }
          },
          {
            opcode: 'setChartVisible',
            blockType: 'command',
            text: '设置折线图 [VISIBLE]',
            arguments: {
              VISIBLE: {
                type: 'string',
                menu: 'visibleMenu',
                defaultValue: '显示'
              }
            }
          },
          {
            opcode: 'setLowFpsThreshold',
            blockType: 'command',
            text: '设置FPS变红阈值 [THRESHOLD]',
            arguments: { THRESHOLD: { type: 'number', defaultValue: 30 } }
          },
          { opcode: 'clearChart', blockType: 'command', text: '清除折线图数据' },
          { opcode: 'getFPS', blockType: 'reporter', text: '当前 FPS' },
          { opcode: 'getMinFPS', blockType: 'reporter', text: '最低 FPS' },
          { opcode: 'getMaxFPS', blockType: 'reporter', text: '最高 FPS' },
          { opcode: 'getAvgFPS', blockType: 'reporter', text: '平均 FPS' }
        ],
        menus: {
          positionMenu: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'custom'],
          visibleMenu: ['显示', '关闭'],
          colorMenu: [
            { text: '绿色', value: '#00FF00' },
            { text: '红色', value: '#FF0000' },
            { text: '白色', value: '#FFFFFF' },
            { text: '黑色', value: '#000000' },
            { text: '青色', value: '#00FFFF' },
            { text: '品红', value: '#FF00FF' },
            { text: '黄色', value: '#FFFF00' },
            { text: '橙色', value: '#FFA500' },
            { text: '浅灰', value: '#CCCCCC' },
            { text: '深灰', value: '#666666' },
            { text: '半透明黑(0.7)', value: 'rgba(0,0,0,0.7)' },
            { text: '半透明黑(0.5)', value: 'rgba(0,0,0,0.5)' },
            { text: '半透明白(0.7)', value: 'rgba(255,255,255,0.7)' },
            { text: '半透明白(0.3)', value: 'rgba(255,255,255,0.3)' }
          ]
        }
      };
    }

    // ---------- 显示/隐藏控制 ----------
    showMonitor() {
      if (this.panel) return;           // 已在显示中
      this.isVisible = true;
      this._createPanel();
      this._startLoop();
    }

    hideMonitor() {
      this.isVisible = false;           // 用户主动隐藏
      this._removePanel();
    }

    // 内部移除面板（不改变 isVisible）
    _removePanel() {
      if (this.animFrameId !== null) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      if (this.panel && this.panel.parentNode) {
        this.panel.parentNode.removeChild(this.panel);
      }
      this.panel = null;
      this.chartCanvas = null;
      this.chartCtx = null;
    }

    // 全屏变化处理
    _handleFullscreenChange() {
      if (this._isFullscreen()) {
        // 进入全屏：如果面板当前显示，则暂时移除
        if (this.isVisible && this.panel) {
          this._removePanel();
        }
      } else {
        // 退出全屏：如果用户仍然期望显示，则恢复面板
        if (this.isVisible && !this.panel) {
          this._createPanel();
          this._startLoop();
        }
      }
    }

    _isFullscreen() {
      return document.fullscreenElement ||
             document.webkitFullscreenElement ||
             document.mozFullScreenElement ||
             document.msFullscreenElement;
    }

    // ---------- 面板创建 ----------
    _createPanel() {
      const panel = document.createElement('div');
      panel.style.position = 'fixed';
      panel.style.backgroundColor = this.bgColor;
      panel.style.padding = '8px';
      panel.style.borderRadius = this.borderRadius + 'px';
      panel.style.fontFamily = 'monospace';
      panel.style.fontWeight = 'bold';
      panel.style.zIndex = '10000';
      panel.style.pointerEvents = 'none';
      panel.style.userSelect = 'none';
      panel.style.color = this.textColor;
      panel.style.fontSize = this.fontSize + 'px';

      // Q弹入场动画
      panel.style.opacity = '0';
      panel.style.transform = 'scale(0.5)';
      panel.style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 1.8, 0.4, 1)';

      this._applyPosition(panel);

      // 文本行
      const textDiv = document.createElement('div');
      textDiv.style.display = 'flex';
      textDiv.style.justifyContent = 'space-between';
      textDiv.style.gap = '8px';
      textDiv.style.marginBottom = '4px';
      panel.appendChild(textDiv);

      const fpsSpan = document.createElement('span');
      fpsSpan.id = 'st-fps-current';
      fpsSpan.textContent = 'FPS: --';
      textDiv.appendChild(fpsSpan);

      const minMaxSpan = document.createElement('span');
      minMaxSpan.id = 'st-fps-minmax';
      minMaxSpan.textContent = 'Min: -- Max: --';
      textDiv.appendChild(minMaxSpan);

      const avgSpan = document.createElement('span');
      avgSpan.id = 'st-fps-avg';
      avgSpan.textContent = 'Avg: --';
      textDiv.appendChild(avgSpan);

      // 折线图
      if (this.showChart) {
        this.chartCanvas = document.createElement('canvas');
        this.chartCanvas.width = this.chartWidth;
        this.chartCanvas.height = this.chartHeight;
        this.chartCanvas.style.borderRadius = '4px';
        this.chartCanvas.style.backgroundColor = this.chartBgColor;
        this.chartCanvas.style.marginTop = '4px';
        panel.appendChild(this.chartCanvas);
        this.chartCtx = this.chartCanvas.getContext('2d');
      }

      document.body.appendChild(panel);
      this.panel = panel;

      requestAnimationFrame(() => {
        panel.style.opacity = '1';
        panel.style.transform = 'scale(1)';
      });
    }

    _applyPosition(panel) {
      panel.style.left = '';
      panel.style.right = '';
      panel.style.top = '';
      panel.style.bottom = '';
      switch (this.position) {
        case 'top-left': panel.style.top = '10px'; panel.style.left = '10px'; break;
        case 'top-right': panel.style.top = '10px'; panel.style.right = '10px'; break;
        case 'bottom-left': panel.style.bottom = '10px'; panel.style.left = '10px'; break;
        case 'bottom-right': panel.style.bottom = '10px'; panel.style.right = '10px'; break;
        case 'custom': panel.style.left = this.customX + 'px'; panel.style.top = this.customY + 'px'; break;
      }
    }

    // ---------- FPS循环 ----------
    _startLoop() {
      this.lastTime = performance.now();
      this.frames = 0;
      const loop = (now) => {
        if (!this.isVisible) return;
        this.frames++;
        if (now - this.lastTime >= 1000) {
          this.fps = Math.round((this.frames * 1000) / (now - this.lastTime));
          this.frames = 0;
          this.lastTime = now;
          this._updateStats();
          this._updateDisplay();
          this._updateChart();
        }
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    }

    _updateStats() {
      this.fpsHistory.push(this.fps);
      if (this.fpsHistory.length > this.chartMaxPoints) this.fpsHistory.shift();
      if (this.fps > this.maxFps) this.maxFps = this.fps;
      if (this.fps < this.minFps) this.minFps = this.fps;
      this.sumFps += this.fps;
      this.countFps++;
      this.avgFps = this.sumFps / this.countFps;
    }

    _updateDisplay() {
      if (!this.panel) return;
      const fpsSpan = document.getElementById('st-fps-current');
      const minMaxSpan = document.getElementById('st-fps-minmax');
      const avgSpan = document.getElementById('st-fps-avg');
      if (fpsSpan) {
        fpsSpan.textContent = 'FPS: ' + this.fps;
        if (this.fps < this.lowFpsThreshold) {
          const ratio = Math.max(0, this.fps / this.lowFpsThreshold);
          const red = Math.round(255 * (1 - ratio * 0.5));
          fpsSpan.style.color = `rgb(255, ${red}, ${red})`;
        } else {
          fpsSpan.style.color = this.textColor;
        }
      }
      if (minMaxSpan) {
        minMaxSpan.textContent = `Min: ${this.minFps === Infinity ? '--' : this.minFps} Max: ${this.maxFps || '--'}`;
      }
      if (avgSpan) {
        avgSpan.textContent = `Avg: ${this.countFps > 0 ? Math.round(this.avgFps) : '--'}`;
      }
    }

    _updateChart() {
      if (!this.showChart || !this.chartCtx || !this.chartCanvas) return;
      const ctx = this.chartCtx;
      const w = this.chartCanvas.width;
      const h = this.chartCanvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = this.chartBgColor;
      ctx.fillRect(0, 0, w, h);
      if (this.fpsHistory.length < 2) return;
      const maxVal = Math.max(...this.fpsHistory, this.maxFps, 1);
      const minVal = Math.min(...this.fpsHistory, this.minFps, 0);
      const range = maxVal - minVal || 1;
      const stepX = w / (this.fpsHistory.length - 1);
      ctx.beginPath();
      for (let i = 0; i < this.fpsHistory.length; i++) {
        const x = i * stepX;
        const y = h - ((this.fpsHistory[i] - minVal) / range) * h;
        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevX = (i - 1) * stepX;
          const prevY = h - ((this.fpsHistory[i-1] - minVal) / range) * h;
          const midX = (prevX + x) / 2;
          ctx.bezierCurveTo(midX, prevY, midX, y, x, y);
        }
      }
      ctx.strokeStyle = this.chartLineColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (this.lowFpsThreshold > minVal && this.lowFpsThreshold < maxVal) {
        const thresholdY = h - ((this.lowFpsThreshold - minVal) / range) * h;
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(255,0,0,0.6)';
        ctx.moveTo(0, thresholdY);
        ctx.lineTo(w, thresholdY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // ---------- 参数设置积木 ----------
    setPosition(args) {
      this.position = args.POS;
      if (this.panel) this._applyPosition(this.panel);
    }

    setCustomPosition(args) {
      this.customX = Number(args.X) || 0;
      this.customY = Number(args.Y) || 0;
      this.position = 'custom';
      if (this.panel) this._applyPosition(this.panel);
    }

    setTextColor(args) {
      this.textColor = String(args.COLOR);
      if (this.panel) {
        const fpsSpan = document.getElementById('st-fps-current');
        if (fpsSpan) fpsSpan.style.color = this.textColor;
      }
    }
    setBgColor(args) {
      this.bgColor = String(args.COLOR);
      if (this.panel) this.panel.style.backgroundColor = this.bgColor;
    }
    setFontSize(args) {
      this.fontSize = Number(args.SIZE) || 14;
      if (this.panel) this.panel.style.fontSize = this.fontSize + 'px';
    }
    setChartLineColor(args) {
      this.chartLineColor = String(args.COLOR);
      if (this.chartCtx) this._updateChart();
    }
    setChartBgColor(args) {
      this.chartBgColor = String(args.COLOR);
      if (this.chartCanvas) {
        this.chartCanvas.style.backgroundColor = this.chartBgColor;
        this._updateChart();
      }
    }
    setChartSize(args) {
      this.chartWidth = Number(args.W) || 180;
      this.chartHeight = Number(args.H) || 60;
      if (this.chartCanvas) {
        this.chartCanvas.width = this.chartWidth;
        this.chartCanvas.height = this.chartHeight;
        this._updateChart();
      }
    }
    setChartMaxPoints(args) {
      this.chartMaxPoints = Math.max(2, Number(args.POINTS) || 60);
      if (this.fpsHistory.length > this.chartMaxPoints) {
        this.fpsHistory = this.fpsHistory.slice(-this.chartMaxPoints);
        this._updateChart();
      }
    }
    setChartVisible(args) {
      this.showChart = (String(args.VISIBLE) === '显示');
      if (!this.panel) return;
      if (this.showChart && !this.chartCanvas) {
        // 需要重新创建折线图
        this.chartCanvas = document.createElement('canvas');
        this.chartCanvas.width = this.chartWidth;
        this.chartCanvas.height = this.chartHeight;
        this.chartCanvas.style.borderRadius = '4px';
        this.chartCanvas.style.backgroundColor = this.chartBgColor;
        this.chartCanvas.style.marginTop = '4px';
        this.panel.appendChild(this.chartCanvas);
        this.chartCtx = this.chartCanvas.getContext('2d');
        this._updateChart();
      } else if (!this.showChart && this.chartCanvas) {
        if (this.chartCanvas.parentNode) this.chartCanvas.parentNode.removeChild(this.chartCanvas);
        this.chartCanvas = null;
        this.chartCtx = null;
      }
    }
    setLowFpsThreshold(args) {
      this.lowFpsThreshold = Number(args.THRESHOLD) || 30;
      this._updateDisplay();
    }
    clearChart() {
      this.fpsHistory = [];
      this.maxFps = 0;
      this.minFps = Infinity;
      this.sumFps = 0;
      this.countFps = 0;
      this.avgFps = 0;
      this._updateDisplay();
      if (this.chartCtx) this._updateChart();
    }

    // 侦测积木
    getFPS() { return this.fps; }
    getMinFPS() { return this.minFps === Infinity ? 0 : this.minFps; }
    getMaxFPS() { return this.maxFps; }
    getAvgFPS() { return this.countFps > 0 ? Math.round(this.avgFps) : 0; }
  }

  Scratch.extensions.register(new FPSMonitor());
})(Scratch);