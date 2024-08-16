const ComputedManager = require('./ComputedManager');
const StateManager = require('./StateManager');
const DomBinder = require('./DomBinder');


// グローバルオブジェクトにクラスを設定
window.BindingEngine = class BindingEngine {
    constructor(rootElementId = "app") {
        this.domBinder = new DomBinder();
        this.computedManager = new ComputedManager();
        this.rootElement = document.getElementById(rootElementId);
        this.methods = {};
        if (!this.rootElement) {
            console.error(`ID '${rootElementId}' を持つ要素が見つかりません。`);
        }
    }

    bindState(state) {
        this.stateManager = new StateManager(state, this.domBinder, this.computedManager);
        this.domBinder.setMethods(this.methods);
        this.computedManager.setStateManager(this.stateManager);
        this.domBinder.scanDom(this.rootElement, this.stateManager);
        this.domBinder.updateAllBindings(this.stateManager.state);
    }

    defineComputed(propertyName, deps, calcFunction) {
         // 計算プロパティを定義
        this.computedManager.defineComputed(propertyName, deps, calcFunction);
    }

    defineMethod(name, method) {
        // console.log(method);
        this.methods[name] = () => method(this.stateManager); // メソッドに stateManager を渡す
        // this.methods[name] = method;
    }
}