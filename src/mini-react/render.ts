let rootContainer: HTMLElement | null = null
let oldDOM: any  = null;

export const render = (vdom: any, container: HTMLElement) => {

    if (!rootContainer) {
        rootContainer = container
    }

    if (!oldDOM) {
        oldDOM = vdom
    }

    updateDOM(container, oldDOM, vdom)
    oldDOM = vdom
}

function updateDOM(parent: HTMLElement, oldNode: any, newNode: any) {
    if (!oldNode) {
        parent.appendChild(createRealNode(newNode))
        return
    }

    if (!newNode) {
        parent.removeChild(parent.firstChild as Node)
        return
    }

    if (oldNode.type !== newNode.type) {
        parent.replaceChild(createRealNode(newNode), parent.firstChild as Node)
    }

    let dom = parent.firstChild as HTMLElement
    if (!dom) {
        dom = createRealNode(newNode)
        parent.appendChild(dom)
    }

    updateProps(dom as HTMLElement, oldNode.props, newNode.props)

    updateChildren(dom, oldNode.props.children, newNode.props.children)
}

function createRealNode(vdom: any) {
    if (vdom.type === 'TEXT_ELEMENT') {
        return document.createTextNode(vdom.props.nodeValue)
    }

    const node = document.createElement(vdom.type)

    updateProps(node, {}, vdom.props)

    vdom.props.children.forEach((child: any) => node.appendChild(createRealNode(child)))

    return node
}

function updateProps(dom: HTMLElement, oldProps: any, newProps: any) {
    Object.keys(oldProps).forEach((name) => {
        if (!(name in newProps)) {
            (dom as any)[name] = ''
        }
    })

    Object.keys(newProps).forEach((name) => {
        if (name !== 'children') {
            (dom as any)[name] = newProps[name]
        }
    })
}

function updateChildren(parent: HTMLElement, oldChildren: any[], newChildren: any[]) {
    const maxLength = Math.max(oldChildren.length, newChildren.length);
  
    for (let i = 0; i < maxLength; i++) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];
  
      if (!newChild) {
        if (parent.childNodes[i]) {
          parent.removeChild(parent.childNodes[i]);
        }
        continue;
      }
  
      if (!oldChild) {
        if (parent.nodeType !== Node.TEXT_NODE) {
          if (newChild.type === "TEXT_ELEMENT") {
            parent.textContent = newChild.props.nodeValue;
          } else {
            parent.appendChild(createRealNode(newChild));
          }
        }
        continue;
      }
  
      if (!parent.childNodes[i]) {
        if (newChild.type === "TEXT_ELEMENT") {
          parent.textContent = newChild.props.nodeValue;
        } else {
          parent.appendChild(createRealNode(newChild));
        }
        continue;
      }
  
      if (parent.childNodes[i].nodeType === Node.TEXT_NODE) {
        (parent.childNodes[i] as Text).nodeValue = newChild.props.nodeValue;
        continue;
      }
  
      updateDOM(parent.childNodes[i] as HTMLElement, oldChild, newChild);
    }
  }
  
  
  