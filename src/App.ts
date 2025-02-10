import {createElement, useState} from './mini-react';

export const App = () => {
    const [count, setCount] = useState<number>(0)

    console.log('kjghksjldhvbjksdbf', 'count', count)
    return createElement("div", {},
        createElement("h1", {}, `Counter value: ${count}`),
        createElement('button', { onclick: () => setCount((prev) => prev + 1) }, `Increase`)
    )
}