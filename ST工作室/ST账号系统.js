// ST游戏账号登录 V1.3.3 - 未登录提示可关闭
(function (Scratch) {
  'use strict';

  class AccountManager {
    constructor() {
      this.currentUser = null;
      this.prefix = 'st_account_';
      this.activeModal = null;
      this.uiBgColor = '#ffffff';
      this.uiTextColor = '#333333';
      this.uiBorderRadius = '12px';
      this.uiMaterial = '纯色';
      this.inputBgColor = '#ffffff';
      this.inputTextColor = '#333333';
      this.inputBorderColor = '#cccccc';
      this._injectStyles();
    }

    getInfo() {
      return {
        id: 'stAccountManager',
        name: 'ST游戏账号登录 V1.3.3',
        color1: '#2196F3',
        color2: '#0D47A1',
        blocks: [
          { opcode: 'register', blockType: 'command', text: '注册账号 [USERNAME] 密码 [PASSWORD]', arguments: { USERNAME: { type: 'string', defaultValue: 'player1' }, PASSWORD: { type: 'string', defaultValue: '123456' } } },
          { opcode: 'emailRegister', blockType: 'command', text: '邮箱验证注册 用户名 [USER] 密码 [PASS] 邮箱 [EMAIL]', arguments: { USER: { type: 'string', defaultValue: 'player1' }, PASS: { type: 'string', defaultValue: '123456' }, EMAIL: { type: 'string', defaultValue: '123456789@qq.com' } } },
          { opcode: 'login', blockType: 'command', text: '登录账号 [USERNAME] 密码 [PASSWORD]', arguments: { USERNAME: { type: 'string', defaultValue: 'player1' }, PASSWORD: { type: 'string', defaultValue: '123456' } } },
          { opcode: 'logout', blockType: 'command', text: '退出登录' },
          { opcode: 'showDeleteAccountUI', blockType: 'command', text: '显示注销账号窗口' },
          { opcode: 'deleteCurrentAccount', blockType: 'command', text: '注销当前账户（永久删除）' },
          { opcode: 'isLoggedIn', blockType: 'Boolean', text: '已登录？' },
          { opcode: 'getCurrentUser', blockType: 'reporter', text: '当前用户名' },
          { opcode: 'saveData', blockType: 'command', text: '保存当前账号数据 [KEY] 值 [VALUE]', arguments: { KEY: { type: 'string', defaultValue: 'score' }, VALUE: { type: 'string', defaultValue: '100' } } },
          { opcode: 'loadData', blockType: 'reporter', text: '读取当前账号数据 [KEY]', arguments: { KEY: { type: 'string', defaultValue: 'score' } } },
          { opcode: 'deleteData', blockType: 'command', text: '删除当前账号数据 [KEY]', arguments: { KEY: { type: 'string', defaultValue: 'score' } } },
          { opcode: 'hasData', blockType: 'Boolean', text: '当前账号存在数据 [KEY] ？', arguments: { KEY: { type: 'string', defaultValue: 'score' } } },
          { opcode: 'setUserData', blockType: 'command', text: '设置账号 [USERNAME] 数据 [KEY] 值 [VALUE]', arguments: { USERNAME: { type: 'string', defaultValue: 'player1' }, KEY: { type: 'string', defaultValue: 'score' }, VALUE: { type: 'string', defaultValue: '100' } } },
          { opcode: 'getUserData', blockType: 'reporter', text: '读取账号 [USERNAME] 数据 [KEY]', arguments: { USERNAME: { type: 'string', defaultValue: 'player1' }, KEY: { type: 'string', defaultValue: 'score' } } },
          { opcode: 'deleteUserData', blockType: 'command', text: '删除账号 [USERNAME] 数据 [KEY]', arguments: { USERNAME: { type: 'string', defaultValue: 'player1' }, KEY: { type: 'string', defaultValue: 'score' } } },
          { opcode: 'hasUserData', blockType: 'Boolean', text: '账号 [USERNAME] 存在数据 [KEY] ？', arguments: { USERNAME: { type: 'string', defaultValue: 'player1' }, KEY: { type: 'string', defaultValue: 'score' } } },
          { opcode: 'accountExists', blockType: 'Boolean', text: '账号 [USERNAME] 存在？', arguments: { USERNAME: { type: 'string', defaultValue: 'player1' } } },
          { opcode: 'deleteAccount', blockType: 'command', text: '删除账号 [USERNAME]', arguments: { USERNAME: { type: 'string', defaultValue: 'player1' } } },
          { opcode: 'showLoginUI', blockType: 'command', text: '显示登录窗口' },
          { opcode: 'showRegisterUI', blockType: 'command', text: '显示注册窗口' },
          { opcode: 'setUIBackgroundColor', blockType: 'command', text: '设置弹窗背景颜色 [COLOR]', arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: '#FFFFFF' } } },
          { opcode: 'setUITextColor', blockType: 'command', text: '设置弹窗文字颜色 [COLOR]', arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: '#333333' } } },
          { opcode: 'setUIBorderRadius', blockType: 'command', text: '设置弹窗圆角 [RADIUS]', arguments: { RADIUS: { type: 'string', defaultValue: '12px' } } },
          { opcode: 'setUIMaterial', blockType: 'command', text: '设置弹窗材质 [MATERIAL]', arguments: { MATERIAL: { type: 'string', menu: 'materialMenu', defaultValue: '纯色' } } },
          { opcode: 'setInputBackgroundColor', blockType: 'command', text: '设置输入框背景颜色 [COLOR]', arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: '#ffffff' } } },
          { opcode: 'setInputTextColor', blockType: 'command', text: '设置输入框文字颜色 [COLOR]', arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: '#333333' } } },
          { opcode: 'setInputBorderColor', blockType: 'command', text: '设置输入框边框颜色 [COLOR]', arguments: { COLOR: { type: 'string', menu: 'colorMenu', defaultValue: '#cccccc' } } }
        ],
        menus: {
          colorMenu: ['#FFFFFF', '#000000', '#333333', '#2196F3', '#4CAF50', '#FF9800', '#f44336', 'rgba(0,0,0,0.8)', 'rgba(255,255,255,0.8)'],
          materialMenu: ['纯色', '毛玻璃', '液态玻璃', '亚克力']
        }
      };
    }

    // 其余代码与 V1.3.2 相同，仅修改 showDeleteAccountUI 方法
    // ... 为节省篇幅，此处省略，请使用上方完整版并替换 showDeleteAccountUI 为以下逻辑：
    showDeleteAccountUI() {
      this._closeModal();
      const overlay = this._createOverlay();
      const dialog = this._createDialog();

      if (!this.currentUser) {
        const msg = document.createElement('p');
        msg.textContent = '请先登录账号';
        msg.style.textAlign = 'center';
        msg.style.color = this.uiTextColor;
        dialog.appendChild(msg);

        // 添加确定按钮，点击关闭提示弹窗
        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.textContent = '确定';
        okBtn.style.cssText = 'display:block;margin:15px auto 0;padding:8px 24px;border:none;border-radius:' + this.uiBorderRadius + ';background:#2196F3;color:white;cursor:pointer;';
        okBtn.onclick = () => this._closeModal();
        dialog.appendChild(okBtn);
      } else {
        // 已登录时显示注销确认窗口（原代码）
        const title = document.createElement('h3');
        title.textContent = '注销账号';
        title.style.margin = '0 0 15px 0';
        title.style.textAlign = 'center';
        title.style.color = this.uiTextColor;
        dialog.appendChild(title);

        const message = document.createElement('p');
        message.textContent = `确定要永久注销账号 "${this.currentUser}" 吗？此操作无法撤销！`;
        message.style.textAlign = 'center';
        message.style.margin = '0 0 15px 0';
        message.style.color = this.uiTextColor;
        message.style.wordBreak = 'break-word';
        dialog.appendChild(message);

        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '10px';
        btnContainer.style.justifyContent = 'center';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = 'padding:8px 16px;border:none;border-radius:' + this.uiBorderRadius + ';background:#9e9e9e;color:white;cursor:pointer;';
        cancelBtn.onclick = () => this._closeModal();
        btnContainer.appendChild(cancelBtn);

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.textContent = '确认注销';
        confirmBtn.style.cssText = 'padding:8px 16px;border:none;border-radius:' + this.uiBorderRadius + ';background:#f44336;color:white;cursor:pointer;';
        confirmBtn.onclick = () => {
          this.deleteCurrentAccount();
          this._closeModal();
          alert('账号已注销');
        };
        btnContainer.appendChild(confirmBtn);

        dialog.appendChild(btnContainer);
      }

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      this.activeModal = overlay;
    }
  }

  Scratch.extensions.register(new AccountManager());
})(Scratch);