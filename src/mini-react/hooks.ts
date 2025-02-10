let state: any[] = []
let stateIndex = 0
let reRender: () => void

export function useState<T>(initialValue: T): [T, (newValue: T | ((prev: T) => T)) => void] {
    const localIndex = stateIndex;

    if (state[localIndex] === undefined) {
        state[localIndex] = initialValue;
    }

    console.log('state[localIndex]', state[localIndex], state)

    const setState = (update: T | ((prev: T) => T)): void => {
        if (typeof update === 'function') {
            state[localIndex] = (update as ((prev: T) => T))(state[localIndex])
        } else {
            state[localIndex] = update;
        }
        stateIndex = 0;
        if (reRender) reRender();
    };

    stateIndex++;

    return [state[localIndex], setState];
}

export const setRender = (callback: () => void) => {
    reRender = () => {
        console.log("🔄 Re-rendering...");
        callback()
    }
}