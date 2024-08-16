const sanitize = require('../utils/sanitize');


class DomBinder {
    constructor() {
        this.bindings = {};
        this.methods = {};
    }

    scanDom(root, stateManager) {
        const elements = root.querySelectorAll('[data-bind]');
        elements.forEach(el => {
            const binding = el.getAttribute('data-bind');
            const [type, prop] = binding.split(':').map(item => item.trim()); //区切って空白削除後値を取得する

            this.setBinding(type, prop, el, stateManager);
        });
    }

    setMethods(methods) {
        this.methods = methods;
    }

    setBinding(type, prop, element, stateManager) {
        //変更するとProxyに飛んで値を書き換え
        if (!this.bindings[prop]) {
            this.bindings[prop] = [];
        }

        this.bindings[prop].push({ type, element });


        //console.log(this.methods);
        // 各イベントタイプに応じたリスナーの追加
        switch (type) {
            case 'click':
                if (this.methods[prop]) {
                    element.addEventListener('click', () => {
                        this.methods[prop](stateManager);
                    });
                }
                break;

            case 'value':
                element.addEventListener('input', () => {
                    stateManager.updateState(prop, element.value);
                });
                break;

            case 'focus':
                if (this.methods[prop]) {
                    element.addEventListener('focus', () => {
                        this.methods[prop](stateManager);
                    });
                }
                break;

            case 'blur':
                if (this.methods[prop]) {
                    element.addEventListener('blur', () => {
                        this.methods[prop](stateManager);
                    });
                }
                break;

            case 'change':
                element.addEventListener('change', () => {
                    stateManager.updateState(prop, element.value);
                });
                break;

            case 'mouseover':
                if (this.methods[prop]) {
                    element.addEventListener('mouseover', () => {
                        this.methods[prop](stateManager);
                    });
                }
                break;

            case 'mouseout':
                if (this.methods[prop]) {
                    element.addEventListener('mouseout', () => {
                        this.methods[prop](stateManager);
                    });
                }
                break;

            // 他のイベントも同様に追加可能
            default:
                console.warn(`サポートされていないイベント タイプ: ${type}`);
        }
    }

    // 特定のプロパティに対してのみバインディングを更新するメソッド
    updateBinding(prop, value) {
        const bindings = this.bindings[prop];
        if (!bindings) return;

        bindings.forEach(binding => {
            let sanitizedValue = sanitize(value);
            switch (binding.type) {
                case 'text':
                    binding.element.textContent = sanitizedValue;
                    break;
                case 'html':
                    binding.element.innerHTML = value;
                    break;
                case 'value':
                    binding.element.value = sanitizedValue;
                    break;
                case 'style':
                    if (typeof value === 'object') {
                        Object.entries(value).forEach(([styleProp, styleValue]) => {
                            binding.element.style[styleProp] = sanitize(styleValue);
                        });
                    } else {
                        binding.element.style.cssText = sanitizedValue;
                    }
                    break;
            }
        });
    }
    // 初期化時に全バインディングを更新するメソッド
    updateAllBindings(state) {
        for (const prop in this.bindings) {
            this.updateBinding(prop, state[prop]);
        }
    }
}


module.exports = DomBinder;