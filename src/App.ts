import {createElement, useState, useEffect} from './mini-react';

export const App = () => {
    const [count, setCount] = useState<number>(0)

    useEffect(() => {
        console.log("🎉 useEffect выполнен! count:", count);
        return () => console.log("🗑 Очистка перед следующим вызовом useEffect()"); 
    }, [count]);

    console.log('kjghksjldhvbjksdbf', 'count', count)
    return createElement("div", {},
        createElement("h1", {}, `Counter value: ${count}`),
        createElement('button', { onclick: () => setCount((prev) => prev + 1) }, `Increase`)
    )
}