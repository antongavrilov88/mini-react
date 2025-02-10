export const createElement = (type: string, props: Record<string, any>, ...children: any[])=> {
    return ({
        type,
        props: {
            ...props,
            children: children.map((child) => typeof child === "string" ? createTextElement(child) : child)
        }
    })
}

export const createTextElement = (text: string) => {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    }
}
