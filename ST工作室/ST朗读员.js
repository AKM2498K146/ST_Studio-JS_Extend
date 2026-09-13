// ST AI朗读 V1.0.9 - 仅中文和英语
(function (Scratch) {
  'use strict';

  class AISpeech {
    constructor() {
      this.synth = window.speechSynthesis || null;
      this.voices = [];
      this.voiceReady = false;
      this.lastText = '';
      if (this.synth) {
        this.voices = this.synth.getVoices();
        if (this.voices.length > 0) this.voiceReady = true;
        this.synth.addEventListener('voiceschanged', () => {
          this.voices = this.synth.getVoices();
          this.voiceReady = true;
        });
      }
    }

    getInfo() {
      const LANGUAGES = ['中文', '英语'];

      return {
        id: 'stAISpeech',
        name: 'ST AI朗读 V1.0.9',
        color1: '#00BCD4',
        color2: '#0097A7',
        blocks: [
          {
            opcode: 'speakText',
            blockType: 'command',
            text: '朗读文本 [TEXT] 语言 [LANG] 语速 [RATE] 音调 [PITCH]',
            arguments: {
              TEXT: { type: 'string', defaultValue: '你好，世界' },
              LANG: { type: 'string', menu: 'languageMenu', defaultValue: '中文' },
              RATE: { type: 'number', defaultValue: 1 },
              PITCH: { type: 'number', defaultValue: 1 }
            }
          },
          {
            opcode: 'isLanguageSupported',
            blockType: 'Boolean',
            text: '语言 [LANG] 是否支持？',
            arguments: {
              LANG: { type: 'string', menu: 'languageMenu', defaultValue: '中文' }
            }
          },
          {
            opcode: 'getLastText',
            blockType: 'reporter',
            text: '上次朗读的文本'
          }
        ],
        menus: {
          languageMenu: LANGUAGES
        }
      };
    }

    _getLangCode(langName) {
      if (langName === '中文') return 'zh-CN';
      if (langName === '英语') return 'en-US';
      return 'zh-CN';
    }

    // 根据语言代码查找匹配的语音
    _findVoiceForLang(langCode) {
      if (!this.voiceReady || this.voices.length === 0) return null;
      const langPrefix = langCode.split('-')[0].toLowerCase();
      // 优先完整匹配
      let match = this.voices.find(v => v.lang && v.lang.toLowerCase() === langCode.toLowerCase());
      if (match) return match;
      // 前缀匹配
      match = this.voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
      return match || null;
    }

    _isLanguageSupported(langName) {
      const langCode = this._getLangCode(langName);
      if (!this.voiceReady) return false;
      return this._findVoiceForLang(langCode) !== null;
    }

    speakText(args) {
      if (!this.synth) {
        console.warn('当前浏览器不支持语音合成');
        return;
      }
      const text = String(args.TEXT);
      const langName = String(args.LANG);
      const rate = Math.max(0.5, Math.min(2, Number(args.RATE) || 1));
      const pitch = Math.max(0, Math.min(2, Number(args.PITCH) || 1));
      if (!text) return;

      this.lastText = text;
      this.synth.cancel();

      const langCode = this._getLangCode(langName);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;

      const voice = this._findVoiceForLang(langCode);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = langCode;
        if (this.voiceReady && this.voices.length > 0) {
          utterance.voice = this.voices[0];
        }
      }

      this.synth.speak(utterance);
    }

    isLanguageSupported(args) {
      return this._isLanguageSupported(String(args.LANG));
    }

    getLastText() {
      return this.lastText;
    }
  }

  Scratch.extensions.register(new AISpeech());
})(Scratch);