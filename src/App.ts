import { createElement, useState, useEffect, useLayoutEffect } from './mini-react';

export const App = () => {
    const [count, setCount] = useState<number>(0)

    useLayoutEffect(() => {
        console.log(`🛠 useLayoutEffect сработал при значении: ${count}`);
    }, [count]);

    useEffect(() => {
        console.log(`🔄 useEffect сработал при значении: ${count}`);
        return () => console.log(`🧹 Очистка useEffect при: ${count}`);
    }, [count]);
    
    return createElement("div", {},
        createElement("h1", {}, `Counter value: ${count}`),
        createElement('button', { onclick: () => setCount((prev) => prev + 1) }, `Increase`)
    )
}