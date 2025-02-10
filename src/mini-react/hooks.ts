let state: any[] = []
let stateIndex = 0
let reRender: () => void

export function useState<T>(initialValue: T): [T, (newValue: T | ((prev: T) => T)) => void] {
    const localIndex = stateIndex;

    if (state[localIndex] === undefined) {
        state[localIndex] = initialValue;
    }

    const setState = (update: T | ((prev: T) => T)): void => {
        if (typeof update === 'function') {
            state[localIndex] = (update as ((prev: T) => T))(state[localIndex])
        } else {
            state[localIndex] = update;
        }
        if (reRender) reRender();
    };

    stateIndex++;

    return [state[localIndex], setState];
}

let effects: { callback: () => void; deps: any[] | undefined; cleanup?: () => void }[] = []
let effectIndex = 0

/**
 * useEffect hook
 * @param callback 
 * @param deps 
 * 
 */
export function useEffect(callback: () => void | (() => void), deps?: any[]) {
    const localIndex = effectIndex

    const prevDeps = effects[localIndex]?.deps

    const hasChanged = !prevDeps || deps?.some((dep, i) => dep !== prevDeps[i])

    if (hasChanged) {
        if (effects[localIndex]?.cleanup) {
            effects[localIndex].cleanup!()
        }

        effects[localIndex] = {
            callback,
            deps,
            cleanup: undefined
        }
    }

    effectIndex++
}

export function runEffects() {
    effects.forEach((effect, index) => {
        if (effect.cleanup) {
            effect.cleanup()
        }

        // @ts-ignore
        effect.cleanup = effect.callback() || undefined
    })
}

export const setRender = (callback: () => void) => {
    reRender = () => {
        stateIndex = 0;
        effectIndex = 0
        callback()
        queueMicrotask(runEffects)
    }
}