// ==TurboWarp Extension==
// name: ST - 分类4列排列（左上角） v1.1.7
// description: 将积木分类图标改为一行最多4个，并保持左上角位置。修复图标变形问题。ST工作室出品。
// author: ST Studio
// @unsandboxed
// ==/TurboWarp Extension==

class STCategory4Columns {
    constructor() {
        this.styleId = 'st-category-4col-style';
        this.initObserver();
        this.applyStyle();
    }

    getInfo() {
        return {
            id: 'stCategory4Columns',
            name: 'ST 分类4列',
            blocks: [] // 无积木，仅用于样式注入
        };
    }

    applyStyle() {
        const menu = document.querySelector('.scratchCategoryMenu');
        if (!menu) return;

        if (document.getElementById(this.styleId)) return;

        const style = document.createElement('style');
        style.id = this.styleId;
        style.textContent = `
            /* ====== 分类菜单容器：4列网格 ====== */
            .scratchCategoryMenu {
                display: grid !important;
                grid-template-columns: repeat(4, 60px) !important;  /* 固定列宽，防止挤压 */
                gap: 4px !important;
                width: auto !important;
                max-width: 260px !important;
                padding: 4px !important;
                box-sizing: border-box !important;
                background: transparent !important;
                align-content: start !important;
            }

            /* ====== 每个分类图标项：固定尺寸，内部居中 ====== */
            .scratchCategoryMenu .scratchCategoryMenuItem {
                width: 60px !important;
                height: 60px !important;
                margin: 0 !important;
                padding: 4px !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
                background: none !important; /* 移除可能存在的背景干扰 */
            }

            /* ====== 图标元素：统一处理 img 和背景图 ====== */
            /* 如果是 img 标签 */
            .scratchCategoryMenu .scratchCategoryMenuItem img {
                max-width: 32px !important;
                max-height: 32px !important;
                width: auto !important;
                height: auto !important;
                object-fit: contain !important;
                display: block !important;
                flex-shrink: 0 !important;
            }

            /* 如果是背景图或 SVG */
            .scratchCategoryMenu .scratchCategoryMenuItem .scratchCategoryItemIcon,
            .scratchCategoryMenu .scratchCategoryMenuItem [class*="icon"] {
                width: 32px !important;
                height: 32px !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                flex-shrink: 0 !important;
                display: block !important;
            }

            /* 针对可能的 SVG 元素 */
            .scratchCategoryMenu .scratchCategoryMenuItem svg {
                max-width: 32px !important;
                max-height: 32px !important;
                width: auto !important;
                height: auto !important;
                flex-shrink: 0 !important;
            }

            /* ====== 分类文字：单行截断 ====== */
            .scratchCategoryMenu .scratchCategoryMenuItem span,
            .scratchCategoryMenu .scratchCategoryMenuItem .scratchCategoryItemLabel {
                font-size: 10px !important;
                line-height: 1.2 !important;
                text-align: center !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                max-width: 100% !important;
                display: block !important;
                width: 100% !important;
                flex-shrink: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    initObserver() {
        const observer = new MutationObserver(() => {
            this.applyStyle();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        this._observer = observer;
    }
}

Scratch.extensions.register(new STCategory4Columns());

// ST v1.1.7