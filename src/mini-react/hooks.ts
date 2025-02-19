let state: any[] = []
let stateIndex = 0
let reRender: () => void
let pendingUpdates: (() => void)[] = []

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
        if (reRender) {
            queueMicrotask(() => {
                while (pendingUpdates.length) pendingUpdates.shift()?.()
                reRender()
            })
        }
    };

    stateIndex++;

    return [state[localIndex], setState];
}

let effects: { callback: () => void; deps: any[] | undefined; cleanup?: () => void, sync: boolean }[] = []
let effectIndex = 0

/**
 * useEffect hook
 * @param callback 
 * @param deps 
 * 
 */
export function useEffect(callback: () => void | (() => void), deps?: any[]) {
    scheduleEffect(callback, deps, false)
}

export function useLayoutEffect(callback: () => void | (() => void), deps?: any[]) {
    scheduleEffect(callback, deps, true)
}

function scheduleEffect(callback: () => void | (() => void), deps?: any[], sync = false) {
    const localIndex = effectIndex
    const prevDeps = effects[localIndex]?.deps

    const hasChanged = !prevDeps || deps?.some((dep, i) => dep !== prevDeps[i])

    if (hasChanged) {
        if (effects[localIndex]?.cleanup) effects[localIndex].cleanup!();
        effects[localIndex] = { callback, deps, cleanup: undefined, sync }
    }
    effectIndex++
}

export function runEffects() {
    effects
        .filter((effect) => effect.sync)
        .forEach(runEffect)

    Promise.resolve().then(() => {
        effects
            .filter((effect) => !effect.sync)
            .forEach(runEffect)
    })
}

function runEffect(effect: { callback: () => void | (() => void); deps?: any[]; cleanup?: () => void }) {
    if (effect.cleanup) effect.cleanup()
    effect.cleanup = effect.callback || undefined
}

export const setRender = (callback: () => void) => {
    reRender = () => {
        stateIndex = 0;
        effectIndex = 0
        callback()
        runEffects()
    }
}