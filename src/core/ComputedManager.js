class ComputedManager {
    constructor() {
        this.stateManager = null; // 初期化時にはまだ stateManager を持たない
        this.computed = {};
    }

    setStateManager(stateManager) {
        this.stateManager = stateManager;
    }

    defineComputed(propertyName, deps, calcFunction) {
        this.computed[propertyName] = { deps, calcFunction, value: undefined };
        this.calculateComputed(propertyName);
    }

    calculateComputed(propertyName) {
        const computed = this.computed[propertyName];
        const newValue = computed.calcFunction(this.stateManager.state);
        if (computed.value !== newValue) {
            computed.value = newValue;
            this.stateManager.domBinder.updateBinding(propertyName, newValue);
        }
    }

    calculateAll(depProperty) {
        Object.keys(this.computed).forEach(propertyName => {
            if (this.computed[propertyName].deps.includes(depProperty)) {
                this.calculateComputed(propertyName);
            }
        });
    }

    getComputed() {
        return this.computed;
    }
}

module.exports = ComputedManager;