// ST设备信息 - 检测操作系统、CPU、GPU、分辨率、刷新率
(function (Scratch) {
  'use strict';

  class DeviceInfo {
    constructor() {
      // 刷新率监测
      this.refreshRate = 60;          // 默认值
      this._lastTime = 0;
      this._frameCount = 0;
      this._rafId = null;

      // 开始监测（后台持续运行）
      this._startRefreshRateMonitor();

      // 缓存GPU信息（创建时获取一次）
      this.gpuInfo = this._getGPUInfo();
    }

    getInfo() {
      return {
        id: 'stDeviceInfo',
        name: 'ST设备信息',
        color1: '#2196F3',
        color2: '#0D47A1',
        blocks: [
          {
            opcode: 'getOS',
            blockType: 'reporter',
            text: '获取操作系统'
          },
          {
            opcode: 'getCPU',
            blockType: 'reporter',
            text: '获取CPU核心数'
          },
          {
            opcode: 'getGPU',
            blockType: 'reporter',
            text: '获取GPU型号'
          },
          {
            opcode: 'getScreenResolution',
            blockType: 'reporter',
            text: '获取屏幕分辨率'
          },
          {
            opcode: 'getDPR',
            blockType: 'reporter',
            text: '获取设备像素比'
          },
          {
            opcode: 'getRefreshRate',
            blockType: 'reporter',
            text: '获取屏幕刷新率'
          }
        ]
      };
    }

    // ---------- 刷新率监测 ----------
    _startRefreshRateMonitor() {
      const loop = (now) => {
        if (this._lastTime === 0) this._lastTime = now;
        this._frameCount++;
        if (now - this._lastTime >= 1000) {
          this.refreshRate = Math.round((this._frameCount * 1000) / (now - this._lastTime));
          this._frameCount = 0;
          this._lastTime = now;
        }
        this._rafId = requestAnimationFrame(loop);
      };
      this._rafId = requestAnimationFrame(loop);
    }

    // ---------- GPU信息获取 ----------
    _getGPUInfo() {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return '不支持WebGL';
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) {
          return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        } else {
          return gl.getParameter(gl.RENDERER);
        }
      } catch (e) {
        return '未知';
      }
    }

    // ---------- 积木实现 ----------
    getOS() {
      const ua = navigator.userAgent;
      let os = '未知';
      if (ua.indexOf('Windows NT') !== -1) os = 'Windows';
      else if (ua.indexOf('Android') !== -1) os = 'Android';
      else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) os = 'iOS';
      else if (ua.indexOf('Mac OS X') !== -1) os = 'macOS';
      else if (ua.indexOf('Linux') !== -1) os = 'Linux';
      return os;
    }

    getCPU() {
      return navigator.hardwareConcurrency || '未知';
    }

    getGPU() {
      return this.gpuInfo;
    }

    getScreenResolution() {
      return window.screen.width + ' x ' + window.screen.height;
    }

    getDPR() {
      return window.devicePixelRatio || 1;
    }

    getRefreshRate() {
      return this.refreshRate + ' Hz';
    }
  }

  Scratch.extensions.register(new DeviceInfo());
})(Scratch);