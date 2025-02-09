const createElement = (elementTag, props, ...children)=> {
    return ({
        type: elementTag,
        props: {
            ...props,
            children: children.map((child) => typeof child === string ? createTextElement(child) : child)
        }
    })
}

const createTextElement = (text) => {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    }
}

const vdom = createElement("div", { id: "app" }, 
  createElement("h1", {}, "Привет, мир!"), 
  createElement("p", {}, "Это мой мини-React!")
);

console.log(vdom);