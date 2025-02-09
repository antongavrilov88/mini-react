const render = (vDOM, continer) => {
    const dom = 
        vdom.type === "TEXT_ELEMENT"
            ? document.createTextNode(vDOM.props.nodeValue)
            : document.createElement(vDOM.type)

    Object.keys(vDOM.props)
        .filter(key => key !== 'children')
        .forEach(name => {
            dom[name] = vDOM.props[name]
        })

    vDOM.props.children.forEach((child) => render(child, dom))

    continer.append(dom)
}