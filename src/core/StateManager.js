class StateManager {
    constructor(initialState, domBinder, computedManager) {
        this.state = new Proxy(initialState, {
            set: (target, property, value) => {
                if (target[property] !== value) {
                    target[property] = value;
                    domBinder.updateBinding(property, value);
                    computedManager.calculateAll(property); //計算
                }

                return true;
            },
            
        });
        this.domBinder = domBinder;
        this.computedManager = computedManager;
    }

    updateState(prop, value) {
        this.state[prop] = value;
    }
}

module.exports = StateManager;