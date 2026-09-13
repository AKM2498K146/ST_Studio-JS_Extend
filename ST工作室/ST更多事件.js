// ST更多事件 V1.0.0 - 修复版
(function (Scratch) {
  'use strict';

  class MoreEvents {
    constructor(runtime) {
      this.runtime = runtime;
      this.timer = 0;
      this.lastTime = 0;
      this.running = false;
      this.hatStates = {
        timer: {},
        loudness: {},
        variable: {}
      };
      this.keyCurrentlyDown = {};
      this.lastKeyPressed = '';
      this.lastKeyReleased = '';
      this.variableValues = {};
      this.rafId = null;
      this._onKeyDown = this._onKeyDown.bind(this);
      this._onKeyUp = this._onKeyUp.bind(this);
      this._start();
    }

    getInfo() {
      return {
        id: 'stMoreEvents',
        name: 'ST更多事件 V1.0.0',
        color1: '#FF9800',
        color2: '#E65100',
        blocks: [
          {
            opcode: 'whenTimerGreaterThan',
            blockType: 'hat',
            text: '当定时器 > [SECONDS] 秒',
            arguments: {
              SECONDS: { type: 'number', defaultValue: 10 }
            }
          },
          {
            opcode: 'whenLoudnessGreaterThan',
            blockType: 'hat',
            text: '当响度 > [VALUE]',
            arguments: {
              VALUE: { type: 'number', defaultValue: 30 }
            }
          },
          {
            opcode: 'whenKeyPressed',
            blockType: 'hat',
            text: '当按下 [KEY] 键',
            arguments: {
              KEY: { type: 'string', menu: 'keyMenu', defaultValue: 'space' }
            }
          },
          {
            opcode: 'whenKeyReleased',
            blockType: 'hat',
            text: '当松开 [KEY] 键',
            arguments: {
              KEY: { type: 'string', menu: 'keyMenu', defaultValue: 'space' }
            }
          },
          {
            opcode: 'whenVariableChanged',
            blockType: 'hat',
            text: '当变量 [VAR_NAME] 改变时',
            arguments: {
              VAR_NAME: { type: 'string', defaultValue: 'my variable' }
            }
          },
          {
            opcode: 'resetTimer',
            blockType: 'command',
            text: '重置定时器'
          },
          {
            opcode: 'getLastKeyPressed',
            blockType: 'reporter',
            text: '最后按下的键'
          }
        ],
        menus: {
          keyMenu: {
            acceptReporters: false,
            items: ['space', 'enter', 'up', 'down', 'left', 'right', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
          }
        }
      };
    }

    // ==================== 生命周期 ====================
    _start() {
      if (this.running || !this.runtime) return;
      this.running = true;
      this.lastTime = Date.now();
      document.addEventListener('keydown', this._onKeyDown, true);
      document.addEventListener('keyup', this._onKeyUp, true);
      this._loop();
    }

    _stop() {
      this.running = false;
      document.removeEventListener('keydown', this._onKeyDown, true);
      document.removeEventListener('keyup', this._onKeyUp, true);
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    // ==================== 主循环 ====================
    _loop() {
      if (!this.running) return;
      this.rafId = requestAnimationFrame(this._loop.bind(this));
      const now = Date.now();
      const delta = (now - this.lastTime) / 1000;
      this.lastTime = now;
      this.timer += delta;
      this._checkTimerHats();
      this._checkLoudnessHats();
      this._checkVariableHats();
    }

    // ==================== 检测函数 ====================
    _checkTimerHats() {
      const hats = this._getHats('stMoreEvents_whenTimerGreaterThan');
      for (const hat of hats) {
        const threshold = Number(hat.args.SECONDS) || 10;
        const key = String(threshold);
        if (this.timer >= threshold && !this.hatStates.timer[key]) {
          this.hatStates.timer[key] = true;
          this._startHat(hat);
        } else if (this.timer < threshold) {
          this.hatStates.timer[key] = false;
        }
      }
    }

    _checkLoudnessHats() {
      const hats = this._getHats('stMoreEvents_whenLoudnessGreaterThan');
      if (hats.length === 0) return;
      let loudness = 0;
      try {
        if (this.runtime.ioDevices && this.runtime.ioDevices.microphone) {
          loudness = this.runtime.ioDevices.microphone.getLoudness() || 0;
        }
      } catch (e) {}
      for (const hat of hats) {
        const threshold = Number(hat.args.VALUE) || 30;
        const key = String(threshold);
        if (loudness >= threshold && !this.hatStates.loudness[key]) {
          this.hatStates.loudness[key] = true;
          this._startHat(hat);
        } else if (loudness < threshold) {
          this.hatStates.loudness[key] = false;
        }
      }
    }

    _checkVariableHats() {
      const hats = this._getHats('stMoreEvents_whenVariableChanged');
      if (hats.length === 0) return;
      for (const hat of hats) {
        const varName = String(hat.args.VAR_NAME).trim();
        if (!varName) continue;
        const currentValue = this._getVariableValue(varName);
        const oldValue = this.variableValues[varName];
        if (currentValue !== oldValue) {
          this.variableValues[varName] = currentValue;
          this._startHat(hat);
        }
      }
    }

    // ==================== 键盘事件 ====================
    _onKeyDown(e) {
      const key = e.key.toLowerCase();
      if (!this.keyCurrentlyDown[key]) {
        this.keyCurrentlyDown[key] = true;
        this.lastKeyPressed = key;
        this._triggerKeyHat('stMoreEvents_whenKeyPressed', key);
      }
    }

    _onKeyUp(e) {
      const key = e.key.toLowerCase();
      if (this.keyCurrentlyDown[key]) {
        this.keyCurrentlyDown[key] = false;
        this.lastKeyReleased = key;
        this._triggerKeyHat('stMoreEvents_whenKeyReleased', key);
      }
    }

    _triggerKeyHat(opcode, key) {
      const hats = this._getHats(opcode);
      for (const hat of hats) {
        const targetKey = String(hat.args.KEY || 'space').toLowerCase();
        if (key === targetKey) {
          this._startHat(hat);
        }
      }
    }

    // ==================== 工具函数 ====================
    _getHats(opcode) {
      if (!this.runtime || !this.runtime._hats) return [];
      return this.runtime._hats[opcode] || [];
    }

    _startHat(hat) {
      try {
        this.runtime.startHats(hat.opcode, hat.args, hat.target || null, hat.thread || null);
      } catch (e) {
        console.warn('启动帽子失败:', e);
      }
    }

    _getVariableValue(varName) {
      if (!this.runtime || !this.runtime.targets) return undefined;
      for (const target of this.runtime.targets) {
        const variable = target.lookupVariableByNameAndType(varName, 'scalar', false) ||
                         target.lookupVariableByNameAndType(varName, '', false);
        if (variable) {
          return target.getVariableValue(variable.id);
        }
      }
      return undefined;
    }

    // ==================== 积木实现 ====================
    resetTimer() {
      this.timer = 0;
      this.hatStates.timer = {};
    }

    getLastKeyPressed() {
      return this.lastKeyPressed;
    }
  }

  Scratch.extensions.register(new MoreEvents(Scratch.vm.runtime));
})(Scratch);